"use client";

import { useCurretRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { ReactNode } from "react";
import FormError from "../FormError";

interface RoleGateProps {
    children: ReactNode;
    allowedRole: UserRole;
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
    const role = useCurretRole();

    if (role !== allowedRole) {
        return (
            <FormError message="You are not authorized to view this page." />
        );
    }

    return <>{children}</>;
};
