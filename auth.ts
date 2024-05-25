import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";

import { getUserById } from "@/data/user";
import authConfig from "@/auth.config";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/twoFactorConfirmation";
import { getAccountByUserId } from "./data/account";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() },
            });
        },
    },
    callbacks: {
        async signIn({ user, account }) {
            console.log({ user, account });

            // Allow OAuth without email verification
            if (account?.provider !== "credentials") return true;

            if (user?.id) {
                const existingUser = await getUserById(user.id);

                // Prevent sign in if email is not verified
                if (!existingUser?.emailVerified) return false;

                if (existingUser.isTwoFactorEnabled) {
                    const twoFactorConfimation =
                        await getTwoFactorConfirmationByUserId(existingUser.id);

                    console.log({ twoFactorConfimation });

                    if (!twoFactorConfimation) return false;

                    // Delete twoFactorConfirmation
                    await db.twoFactorConfimation.delete({
                        where: { id: twoFactorConfimation.id },
                    });
                }
            }

            return true;
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole;
            }

            if (session.user) {
                session.user.isTwoFactorEnabled =
                    token.isTwoFactorEnabled as boolean;
            }

            if (session.user && token.email && token.name) {
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.isOAuth = token.isOAuth as boolean;
            }
            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);

            if (!existingUser) return token;

            const existinAccount = await getAccountByUserId(existingUser.id);

            token.isOAuth = !!existinAccount;
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

            return token;
        },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
});
