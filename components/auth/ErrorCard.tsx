import { CardWrapper } from "@/components/auth/CardWrapper";
import { FaTriangleExclamation } from "react-icons/fa6";

export default function ErrorCard() {
    return (
        <CardWrapper
            headerLabel="Oops! Something went wrong!"
            backButtonHref="/auth/login"
            backButtonLabel="Back to  signin"
        >
            <div className="w-full flex items-center justify-center">
                <FaTriangleExclamation className="text-destructive h-6 w-6" />
            </div>
        </CardWrapper>
    );
}
