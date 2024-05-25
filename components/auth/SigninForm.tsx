"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";

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
import { FaSpinner } from "react-icons/fa";
import Link from "next/link";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

export default function SigninForm() {
    const searchParams = useSearchParams();
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [formMessage, setFormMessage] = useState<{
        success: boolean;
        message: string;
    }>();

    useEffect(() => {
        if (searchParams.get("error")) {
            setFormMessage({
                success: false,
                message:
                    searchParams.get("error") === "OAuthAccountNotLinked"
                        ? "Email already exists. Please sign in with your email and password."
                        : "An unexpected error occurred",
            });
        }
    }, [searchParams]);

    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof SigninSchema>>({
        resolver: zodResolver(SigninSchema),
        defaultValues: {
            email: "",
            password: "",
            code: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof SigninSchema>) => {
        console.log({ data });

        startTransition(() => {
            signin(data).then((response) => {
                if (response) {
                    setFormMessage({
                        success: response.success ?? false,
                        message: response.message ?? "",
                    });

                    if (!response.twoFactor) {
                        form.reset();
                    }
                }

                if (response?.twoFactor) {
                    setShowTwoFactor(true);
                }
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
                        {showTwoFactor && (
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex justify-center mb-4">
                                            Enter OTP sent to your email
                                        </FormLabel>
                                        <FormControl>
                                            <InputOTP {...field} maxLength={6}>
                                                <InputOTPGroup className="ml-auto">
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                </InputOTPGroup>
                                                <InputOTPGroup className="mr-auto">
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        {!showTwoFactor && (
                            <>
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
                                            <Button
                                                size="sm"
                                                variant="link"
                                                asChild
                                                className="px-0 font-normal"
                                            >
                                                <Link href="/auth/forgot-password">
                                                    Forgot password?
                                                </Link>
                                            </Button>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
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
                        {isPending ? (
                            <>
                                <FaSpinner className="animate-spin mr-2" />
                                Signing in...
                            </>
                        ) : showTwoFactor ? (
                            "Confirm"
                        ) : (
                            "Sign in"
                        )}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}
