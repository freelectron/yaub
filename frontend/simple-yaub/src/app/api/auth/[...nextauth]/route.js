import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const response = await fetch("http://localhost:3001/api/signin", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(credentials),
                });

                if (response.ok) {
                    const user = await response.json();

                    console.log(process.env.NEXTAUTH_SECRET);

                    return user; // Authentication successful
                }
                return null; // Authentication failed
            },
        }),
    ],
    pages: {
        signIn: "/", // Redirect to login page
    },
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.sub; // Attach user ID to session
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET, // Set this in your .env file
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
