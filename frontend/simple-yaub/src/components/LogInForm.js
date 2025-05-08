"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginForm({ onClose }) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");
        const name = formData.get("name");

        // If name is present, this is a registration attempt
        if (name) {
            // TODO: Implement registration logic
            console.log("Registration attempt with:", { name, email, password });
            return;
        }

        const response = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (response.ok) {
            onClose();
        } else {
            setError("Invalid credentials. Please try again.");
        }
        setLoading(false);
    }

    const [activeTab, setActiveTab] = useState("signin");

    return (
        <div className="signing-window">
            <input type="radio" name="tab" id="signin" defaultChecked />
            <input type="radio" name="tab" id="register" />
            <div className="pages">
                <div className="page signinActive">
                    <form onSubmit={handleSubmit}>
                        <div className="input">
                            <div className="title">Username</div>
                            <input className="text" type="text" name="email" placeholder="" required />
                        </div>
                        <div className="input">
                            <div className="title">Password</div>
                            <input className="text" type="password" name="password" placeholder="" required />
                        </div>
                        <div className="input">
                            <input type="submit" value="Enter" disabled={loading} />
                        </div>
                    </form>
                </div>
                <div className="page signup">
                    <form onSubmit={handleSubmit}>
                        <div className="input">
                            <div className="title">Name</div>
                            <input className="text" type="text" name="name" placeholder="" required />
                        </div>
                        <div className="input">
                            <div className="title">Email</div>
                            <input className="text" type="email" name="email" placeholder="" required />
                        </div>
                        <div className="input">
                            <div className="title">Password</div>
                            <input className="text" type="password" name="password" placeholder="" required />
                        </div>
                        <div className="input">
                            <input type="submit" value="Sign Me Up!" disabled={loading} />
                        </div>
                    </form>
                </div>
            </div>
            <div className="tabs">
                <label className="tab" htmlFor="signin">
                    <span className="text">Sign In</span>
                </label>
                <label className="tab" htmlFor="register" >
                    <span className="text">Register</span>
                </label>
            </div>
            {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        </div>
    );
}