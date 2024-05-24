"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";

import { CardWrapper } from "@/components/auth/CardWrapper";
import {
    Form,
    FormLabel,
    FormItem,
    FormMessage,
    FormControl,
    FormField,
} from "@/components/ui/form";
import { ForgotPasswordSchema } from "@/schemas";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import { forgotPassword } from "@/actions/forgot-password";

export default function ForgotPasswordForm() {
    const [formMessage, setFormMessage] = useState<{
        success: boolean;
        message: string;
    }>();

    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof ForgotPasswordSchema>) => {
        startTransition(() => {
            forgotPassword(data).then((response) => {
                if (response) {
                    setFormMessage({
                        success: response.success ?? false,
                        message: response.message ?? "",
                    });
                }

                form.setValue("email", "");
            });
        });
        console.log(data);
    };
    return (
        <CardWrapper
            headerLabel="Forgot password?"
            backButtonLabel="Back to login"
            backButtonHref="/auth/signin"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="johndoe@example.com"
                                            type="email"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {formMessage?.success ? (
                        <FormSuccess message={formMessage?.message} />
                    ) : (
                        <FormError message={formMessage?.message} />
                    )}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        Send reset email
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}
