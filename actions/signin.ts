"use server";

import { z } from "zod";
import { AuthError } from "next-auth";

import { SigninSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { getUserByEmail } from "@/data/user";
import { getTwoFactorTokenByEmail } from "@/data/twoFactorToken";
import {
    generateVerificationToken,
    generateTwoFactorToken,
} from "@/lib/tokens";
import { sendVerificationEmail, sendTwoFactorEmail } from "@/lib/mail";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/twoFactorConfirmation";

export const signin = async (values: z.infer<typeof SigninSchema>) => {
    const validatedfields = SigninSchema.safeParse(values);

    if (!validatedfields.success) {
        return { success: false, message: "Invalid fields" };
    }

    const { email, password, code } = validatedfields.data;

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

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(
                existingUser.email
            );

            if (!twoFactorToken) {
                return {
                    success: false,
                    message: "Invalid code",
                };
            }

            if (twoFactorToken.token !== code) {
                return {
                    success: false,
                    message: "Invalid code",
                };
            }

            const isExpired = new Date(twoFactorToken.expires) < new Date();

            if (isExpired) {
                return {
                    success: false,
                    message: "Code expired",
                };
            }

            await db.twoFactorToken.delete({
                where: {
                    id: twoFactorToken.id,
                },
            });

            const existingConfirmation = await getTwoFactorConfirmationByUserId(
                existingUser.id
            );

            if (existingConfirmation) {
                await db.twoFactorConfimation.delete({
                    where: {
                        id: existingConfirmation.id,
                    },
                });
            }

            await db.twoFactorConfimation.create({
                data: {
                    userId: existingUser.id,
                },
            });
        } else {
            const twoFactorToken = await generateTwoFactorToken(
                existingUser.email
            );

            await sendTwoFactorEmail(
                twoFactorToken.email,
                twoFactorToken.token
            );

            return {
                success: true,
                message: "Two-factor email sent!",
                twoFactor: true,
            };
        }
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
