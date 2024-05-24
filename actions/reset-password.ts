"use server";

import { z } from "zod";
import bcryptjs from "bcryptjs";

import { ResetPasswordSchema } from "@/schemas";
import { getResetPasswordByToken } from "@/data/forgotPassword";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";

export const resetPassword = async (
    values: z.infer<typeof ResetPasswordSchema>,
    token: string | null
) => {
    if (!token) {
        return {
            success: false,
            message: "No token found",
        };
    }

    const validatedFields = ResetPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Invalid fields",
        };
    }

    const { password } = validatedFields.data;

    const existingToken = await getResetPasswordByToken(token);

    if (!existingToken) {
        return {
            success: false,
            message: "Invalid token",
        };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return {
            success: false,
            message: "Token has expired",
        };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return {
            success: false,
            message: "User not found",
        };
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await db.user.update({
        where: { id: existingUser.id },
        data: {
            password: hashedPassword,
        },
    });

    await db.passwordResetToken.delete({
        where: { id: existingToken.id },
    });

    return {
        success: true,
        message: "Password updated",
    };
};
