import ErrorCard from "@/components/auth/ErrorCard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Error",
    description: "An error occurred while processing your request.",
};

export default function AuthError() {
    return <ErrorCard />;
}
