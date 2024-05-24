import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function SettingsPage() {
    const session = await auth();

    return (
        <div>
            {JSON.stringify(session)}
            <form
                action={async () => {
                    "use server";

                    await signOut().then(() => {
                        redirect("/auth/signin");
                    });
                }}
            >
                <button type="submit">Sign Out</button>
            </form>
        </div>
    );
}
