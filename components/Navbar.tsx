import { auth, signIn, signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";

import { Button } from "./ui/button";

function SignOut() {
    return (
        <form
            action={async () => {
                "use server";

                await signOut();
            }}
        >
            <Button type="submit">Sign Out</Button>
        </form>
    );
}

export default async function Header() {
    const session = await auth();
    console.log(session);

    return (
        <header className="border-b bottom-1">
            <nav className="bg-white border-gray-200 px-4 py-2.5">
                <div className="flex flex-wrap justify-between  items-center max-w-screen-xl mx-auto">
                    <h1>Next-Auth</h1>

                    {session?.user ? (
                        <div className="flex gap-5 items-center">
                            <Image
                                src={session.user.image || ""}
                                alt="User Image"
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                            <SignOut />
                        </div>
                    ) : (
                        <Link href="/api/auth/signin">
                            <Button>Sign In</Button>
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}
