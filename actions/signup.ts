"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import bcryptjs from "bcryptjs";
import { z } from "zod";

import { SignupSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const signup = async (values: z.infer<typeof SignupSchema>) => {
    const validatedfields = SignupSchema.safeParse(values);

    if (!validatedfields.success) {
        return { success: false, message: "Invalid fields" };
    }

    const { email, password, name } = validatedfields.data;

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { success: false, message: "User already exists" };
    }

    await db.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });

    //TODO: Send verification token email

    return { success: true, message: "User created" };
};
