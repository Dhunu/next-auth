"use server";

import { ForgotPasswordSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { z } from "zod";

import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";

export const forgotPassword = async (
    values: z.infer<typeof ForgotPasswordSchema>
) => {
    const validatedFields = ForgotPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Invalid email address",
        };
    }

    const { email } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return {
            success: false,
            message: "User not found",
        };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
    );

    return {
        success: true,
        message: "Password reset link sent to your email address",
    };
};
