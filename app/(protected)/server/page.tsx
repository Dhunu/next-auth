import { UserInfo } from "@/components/UserInfo";
import { currentUser } from "@/lib/auth";
import React from "react";

export default async function Server() {
    const user = await currentUser();
    return (
        <div>
            <UserInfo user={user} label="💻 Server Component" />
        </div>
    );
}
