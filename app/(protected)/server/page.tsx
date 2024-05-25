import { UserInfo } from "@/components/UserInfo";
import { currentUser } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Server",
    description: "Server-side rendered page.",
};

export default async function Server() {
    const user = await currentUser();
    return (
        <div>
            <UserInfo user={user} label="💻 Server Component" />
        </div>
    );
}
