import { useSession } from "next-auth/react";

export const useCurretRole = () => {
    const session = useSession();

    return session.data?.user.role;
};
