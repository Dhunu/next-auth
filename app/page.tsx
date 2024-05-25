import { SigninButton } from "@/components/auth/SigninButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

export default function Home() {
    return (
        <main className="flex w-full h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800">
            <div className="space-y-6 text-center">
                <h1
                    className={cn(
                        "text-6xl font-semibold text-white drop-shadow-md",
                        font.className
                    )}
                >
                    🔐 Next-Auth
                </h1>
                <p className="text-white text-lg">
                    A Next.js starter with authentication using NextAuth.js
                </p>
                <div className="flex flex-col gap-5">
                    <SigninButton mode="modal" asChild>
                        <Button
                            variant="secondary"
                            size="lg"
                            className="w-40 mx-auto"
                        >
                            Sign In (Modal)
                        </Button>
                    </SigninButton>
                    <SigninButton>
                        <Button
                            variant="secondary"
                            size="lg"
                            className="w-40 mx-auto"
                        >
                            Sign In (Redirect)
                        </Button>
                    </SigninButton>
                </div>
            </div>
        </main>
    );
}
