"use client";

import { signout } from "@/actions/signout";
import { ReactNode } from "react";

interface SignoutProps {
    children: ReactNode;
}

export const Signout = ({ children }: SignoutProps) => {
    const onClick = () => {
        signout();
    };

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    );
};
