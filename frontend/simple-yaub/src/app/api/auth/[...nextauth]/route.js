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
                // FIXME: Replace with a database call
                const user = { id: "1", name: "admin", email: "admin@example.com" };

                if (credentials.email === "admin@admin.com" && credentials.password === "1234") {
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
