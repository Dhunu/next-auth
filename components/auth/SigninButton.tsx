"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SigninForm from "@/components/auth/SigninForm";

interface LoginButtonProps {
    children: ReactNode;
    mode?: "modal" | "redirect";
    asChild?: boolean;
}

export const SigninButton = ({
    children,
    mode = "redirect",
    asChild,
}: LoginButtonProps) => {
    const router = useRouter();
    const onClick = () => {
        router.push("/auth/signin");
    };

    if (mode === "modal") {
        return (
            <Dialog>
                <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
                <DialogContent className="p-0 w-auto bg-transparent border-none">
                    <SigninForm />
                </DialogContent>
            </Dialog>
        );
    }
    return (
        <span className="cursor-pointer" onClick={onClick}>
            {children}
        </span>
    );
};
