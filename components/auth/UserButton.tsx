"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa6";
import { RxExit } from "react-icons/rx";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Signout } from "./SignoutButton";

export const UserButton = () => {
    const user = useCurrentUser();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback className="bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800">
                        <FaUser className="text-white" />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
                <Signout>
                    <DropdownMenuItem>
                        <RxExit className="h-4 w-4 mr-2" />
                        Signout
                    </DropdownMenuItem>
                </Signout>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
