"use server";

import { z } from "zod";
import bcryptjs from "bcryptjs";

import { db } from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
    const user = await currentUser();

    if (!user) {
        return { success: false, message: "User not found" };
    }

    if (user && user.id) {
        const dbUser = await getUserById(user.id);

        if (!dbUser) {
            return { success: false, message: "User not found" };
        }

        if (user.isOAuth) {
            values.email = undefined;
            values.password = undefined;
            values.newPassword = undefined;
            values.isTwoFactorEnabled = undefined;
        }

        if (values.email && values.email !== user.email) {
            const existingUser = await getUserByEmail(values.email);

            if (existingUser && existingUser.id !== user.id) {
                return { success: false, message: "Email already exists" };
            }

            const verificationToken = await generateVerificationToken(
                values.email
            );

            await sendVerificationEmail(
                verificationToken.email,
                verificationToken.token
            );

            console.log("Email verification sent");

            return {
                success: true,
                message: "Email verification sent",
            };
        }

        if (values.password && values.newPassword && dbUser.password) {
            const passwordMatch = await bcryptjs.compare(
                values.password,
                dbUser.password
            );

            if (!passwordMatch) {
                return { success: false, message: "Incorrect password" };
            }

            const hashedPassword = await bcryptjs.hash(values.newPassword, 10);

            values.password = hashedPassword;
            values.newPassword = undefined;
        }

        await db.user.update({
            where: { id: dbUser.id },
            data: {
                ...values,
            },
        });

        return { success: true, message: "Settings updated" };
    }
};
