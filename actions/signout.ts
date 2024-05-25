"use server";

import { signOut } from "@/auth";

export const signout = async () => {
    // some server stuff
    await signOut();
};
