"use server";

import { z } from "zod";
import { AuthError } from "next-auth";

import { SigninSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const signin = async (values: z.infer<typeof SigninSchema>) => {
    const validatedfields = SigninSchema.safeParse(values);

    if (!validatedfields.success) {
        return { success: false, message: "Invalid fields" };
    }

    const { email, password } = validatedfields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { success: false, message: "Email doesnot exist!" };
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(
            existingUser.email
        );

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        );

        return { success: true, message: "Confimation email sent!" };
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { success: false, message: "Invalid credentials" };
                default:
                    return { success: false, message: "An error occurred" };
            }
        }

        throw error;
    }
};
