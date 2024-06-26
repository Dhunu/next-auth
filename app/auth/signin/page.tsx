import SigninForm from "@/components/auth/SigninForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign in to your account.",
};

export default function SignIn() {
    return <SigninForm />;
}
