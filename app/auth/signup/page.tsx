import SignupForm from "@/components/auth/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Create a new account.",
};

export default function SignUp() {
    return <SignupForm />;
}
