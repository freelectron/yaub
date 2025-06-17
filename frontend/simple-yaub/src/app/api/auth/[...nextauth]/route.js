import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "slimshady@popsiclesucker.com" },
                password: { label: "Password", type: "inbetweenlife" },
            },
            async authorize(credentials) {
                const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
                const response = await fetch(`${backendURL}/api/signin`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(credentials),
                });

                if (response.ok) {
                    const user = await response.json();
                    return {
                        id: user._id,
                        name: user.name,
                        email: user.credentials.email
                    };
                }
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 2 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
