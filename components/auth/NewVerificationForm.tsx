"use client";

import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { CardWrapper } from "@/components/auth/CardWrapper";
import { newVerifiction } from "@/actions/new-verification";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";

export default function NewVerificationForm() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [formMessage, setFormMessage] = useState<{
        success: boolean;
        message: string;
    }>();
    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const onSubmit = useCallback(async () => {
        if (!token) {
            setFormMessage({
                success: false,
                message: "Token not found",
            });
            return;
        }

        newVerifiction(token)
            .then((data) => {
                setFormMessage({
                    success: data.success,
                    message: data.message,
                });
            })
            .catch(() => {
                setFormMessage({
                    success: false,
                    message: "An error occurred",
                });
            });
    }, [token]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);
    return (
        <CardWrapper
            headerLabel="Confirming your verification"
            backButtonLabel="Back to signin"
            backButtonHref="/auth/signin"
        >
            <div className="flex items-center w-full justify-center">
                {!mounted && <BeatLoader />}
                {formMessage && formMessage.success && (
                    <FormSuccess message={formMessage.message} />
                )}
                {formMessage && !formMessage.success && (
                    <FormError message={formMessage.message} />
                )}
            </div>
        </CardWrapper>
    );
}
