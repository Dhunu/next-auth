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
import { SigninSchema } from "@/schemas";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import { signin } from "@/actions/signin";

export default function SigninForm() {
    const [formMessage, setFormMessage] = useState<{
        success: boolean;
        message: string;
    }>();
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof SigninSchema>>({
        resolver: zodResolver(SigninSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof SigninSchema>) => {
        startTransition(() => {
            signin(data).then((response) => {
                if (response) {
                    setFormMessage({
                        success: response.success ?? false,
                        message: response.message ?? "",
                    });
                }

                form.setValue("email", "");
                form.setValue("password", "");
            });
        });
    };
    return (
        <CardWrapper
            headerLabel="Welcome back"
            backButtonLabel="Don't have and account?"
            backButtonHref="/auth/signup"
            showSocial
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
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="********"
                                            type="password"
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
                        Sign in
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}
