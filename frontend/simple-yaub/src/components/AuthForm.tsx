"use client";

import { useState, FormEvent } from "react";
import { signIn, signOut } from "next-auth/react";

interface AuthFormProps {
    onClose: () => void;
    session: any;
    status?: string;
}

export default function AuthForm({ onClose, session, status }: AuthFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    async function handleSubmitSignIn(eventSignIn: FormEvent<HTMLFormElement>) {
        eventSignIn.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(eventSignIn.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const response = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (response?.ok) {
            onClose();
        } else {
            setError("Invalid credentials. Please try again.");
        }
        setLoading(false);
    }

    async function handleSubmitSignUp(eventSignUp: FormEvent<HTMLFormElement>) {
        eventSignUp.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(eventSignUp.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const passwordConfirmation = formData.get("password_confirmation") as string;
        const name = formData.get("name") as string;

        const backendURLPublic = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

        if (password !== passwordConfirmation) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${backendURLPublic}/api/register_user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, credentials: { email, password } }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Something went wrong");
            }

            alert("Registration successful! Please wait — we will process your account in 1-2 minutes.");
        } catch (err: any) {
            setError(err.message || "An error occurred during registration");
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
    }

    return (
        <div className="signing-window">
            <input type="radio" name="tab" id="signin" defaultChecked />
            <input type="radio" name="tab" id="register" />

            <div className="pages">
                <div className="page signinActive">
                    <form onSubmit={handleSubmitSignIn}>
                        <div className="input">
                            <div className="title">Username (email)</div>
                            <input className="text" type="text" name="email" required />
                        </div>
                        <div className="input">
                            <div className="title">Password</div>
                            <input className="text" type="password" name="password" required />
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
                            <input className="text" type="text" name="name" required />
                        </div>
                        <div className="input">
                            <div className="title">Email</div>
                            <input className="text" type="email" name="email" required />
                        </div>
                        <div className="input">
                            <div className="title">Password</div>
                            <input className="text" type="password" name="password" required />
                        </div>
                        <div className="input">
                            <div className="title">Repeat Password</div>
                            <input className="text" type="password" name="password_confirmation" required />
                        </div>
                        <div className="input">
                            <input type="submit" value="Sign Me Up!" disabled={loading} />
                        </div>
                    </form>
                </div>
            </div>

            <div className="tabs">
                <label className="tab" htmlFor="signin">Sign In</label>
                <label className="tab" htmlFor="register">Register</label>
            </div>

            {error && <p className="error-text">{error}</p>}
        </div>
    );
}
