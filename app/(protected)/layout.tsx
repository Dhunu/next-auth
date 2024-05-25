import { ReactNode } from "react";
import Navbar from "./_components/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Home",
        template: "%s | Next-Auth",
    },
    description: "These are the page in the root",
};

interface ProtectedLayoutProps {
    children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
    return (
        <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800">
            <Navbar />
            {children}
        </div>
    );
}
