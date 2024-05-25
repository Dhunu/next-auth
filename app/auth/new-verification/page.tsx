import NewVerificationForm from "@/components/auth/NewVerificationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Verification",
    description: "Verify your email address.",
};

export default function NewVerification() {
    return <NewVerificationForm />;
}
