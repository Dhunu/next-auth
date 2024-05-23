import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";

import { SigninSchema } from "@/schemas";
import { getUserByEmail } from "./data/user";

export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = SigninSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    const user = await getUserByEmail(email);

                    if (!user || !user.password) return null;

                    const isValid = bcryptjs.compareSync(
                        password,
                        user.password
                    );

                    if (isValid) return user;
                }

                return null;
            },
        }),
    ],
} satisfies NextAuthConfig;
