"use client";

import { useState } from "react";
import {signIn, signOut} from "next-auth/react";

export default function AuthForm({ onClose, session, status }) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmitSignIn(eventSignIn) {
        eventSignIn.preventDefault();
        // Use the same states for both sign in and sign up
        setLoading(true);
        setError(null);

        const formData = new FormData(eventSignIn.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

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

    async function handleSubmitSignUp(eventSignUp) {
        eventSignUp.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(eventSignUp.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");
        const passwordConfirmation = formData.get("password_confirmation");
        const name = formData.get("name");

        const backendURLPublic = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

        if (password !== passwordConfirmation) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${backendURLPublic}/api/register_user`, { // Replace with your actual register endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, credentials: {email, password}}),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong');
            }

            // No error — registration request was successful (even if confirmation is pending)
            alert('Registration successful! Please wait — we will process your account in 1-2 minutes.');

        } catch (err) {
            setError(err.message || 'An error occurred during registration');
        } finally {
            setLoading(false);
        }
    }

    if (session) {
        return (
            <div className="logout-window">
                <p>You are already logged in as <b>{session.user?.email || session.user?.name}</b>.</p>
                <div className="input">
                    <button
                        onClick={async () => {
                            await signOut({ redirect: false });
                            onClose();
                        }}
                        disabled={loading}
                    >
                        Log out
                    </button>
                    <button onClick={onClose} style={{ marginLeft: 8 }}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    } else {
    return (
        <div className="signing-window">
            <input type="radio" name="tab" id="signin" defaultChecked />
            <input type="radio" name="tab" id="register" />
            <div className="pages">
                <div className="page signinActive">
                    <form onSubmit={handleSubmitSignIn}>
                        <div className="input">
                            <div className="title">Username (email)</div>
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
                    <form onSubmit={handleSubmitSignUp}>
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
                            <div className="title">Repeat Password</div>
                            <input className="text" type="password" name="password_confirmation" placeholder="" required />
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
            {error && <p className="error-text">{error}</p>}
        </div>
    );
    }
}