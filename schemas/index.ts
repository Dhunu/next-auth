import * as z from "zod";

export const SigninSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
    code: z.optional(z.string()),
});

export const SignupSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Minimum 6 characters required" }),
    name: z.string().min(1, { message: "Name is required" }),
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});

export const ResetPasswordSchema = z.object({
    password: z.string().min(6, { message: "Minimum 6 characters required" }),
});
