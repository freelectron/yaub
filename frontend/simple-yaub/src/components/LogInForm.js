"use client";

import { useState } from "react";

export default function LoginForm({ onClose }) {
    const [error, setError] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            onClose(); // Close modal on success
        } else {
            setError("Invalid credentials. Please try again.");
        }
    }

    return (
        <div>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="mb-3 p-2 border rounded-md"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    className="mb-3 p-2 border rounded-md"
                />
                <button type="submit" className="bg-blue-600 text-white p-2 transition">
                    Login
                </button>
            </form>
            <button onClick={onClose} className="mt-3 text-red-500 hover:underline">
                Cancel
            </button>
        </div>
    );
}
