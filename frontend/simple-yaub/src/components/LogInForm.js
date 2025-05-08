"use client";

import { useState, useEffect } from "react";
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

    return (
        <div className="signing-window">
            <input type="radio" name="tab" id="signin" defaultChecked />
            <input type="radio" name="tab" id="register" />
            <div className="pages">
                <div className="page">
                    <form onSubmit={handleSubmit}>
                        <div className="input">
                            <div className="title">
                                <i className="material-icons">account_box</i> USERNAME
                            </div>
                            <input className="text" type="text" name="email" placeholder="" required />
                        </div>
                        <div className="input">
                            <div className="title">
                                <i className="material-icons">lock</i> PASSWORD
                            </div>
                            <input className="text" type="password" name="password" placeholder="" required />
                        </div>
                        <div className="input">
                            <input type="submit" value="ENTER" disabled={loading} />
                        </div>
                    </form>
                </div>
                <div className="page signup">
                    <form onSubmit={handleSubmit}>
                        <div className="input">
                            <div className="title">
                                <i className="material-icons">person</i> NAME
                            </div>
                            <input className="text" type="text" name="name" placeholder="" required />
                        </div>
                        <div className="input">
                            <div className="title">
                                <i className="material-icons">markunread_mailbox</i> EMAIL
                            </div>
                            <input className="text" type="email" name="email" placeholder="" required />
                        </div>
                        <div className="input">
                            <input type="submit" value="SIGN ME UP!" disabled={loading} />
                        </div>
                    </form>
                </div>
            </div>
            <div className="tabs">
                <label className="tab" htmlFor="signin">
                    <span className="text">Sign In</span>
                </label>
                <label className="tab" htmlFor="register">
                    <span className="text">Register</span>
                </label>
            </div>
            {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        </div>
    );
}
