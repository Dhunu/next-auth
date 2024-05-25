import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Forgot Password",
    description: "Forgot your password? No worries! Reset it here.",
};

export default function ForgotPassword() {
    return <ForgotPasswordForm />;
}
