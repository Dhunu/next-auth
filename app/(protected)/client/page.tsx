"use client";

import { UserInfo } from "@/components/UserInfo";
import { useCurrentUser } from "@/hooks/use-current-user";
import React from "react";

export default function Client() {
    const user = useCurrentUser();
    return (
        <div>
            <UserInfo user={user} label="📞 Client Component" />
        </div>
    );
}
