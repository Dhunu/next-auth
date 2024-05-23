"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import { SigninSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const signin = async (values: z.infer<typeof SigninSchema>) => {
    const validatedfields = SigninSchema.safeParse(values);

    if (!validatedfields.success) {
        return { success: false, message: "Invalid fields" };
    }

    const { email, password } = validatedfields.data;

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
