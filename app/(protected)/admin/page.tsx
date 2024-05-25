"use client";

import FormSuccess from "@/components/FormSuccess";
import { RoleGate } from "@/components/auth/RoleGate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurretRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

export default function Admin() {
    const role = useCurretRole();
    const onAPIRouteClick = () => {
        fetch("/api/admin").then((res) => {
            if (res.ok) {
                toast.success("Allower API route");
            } else {
                toast.error("Forbidden API route");
            }
        });
    };
    return (
        <Card className="w-[600px] shadow-md">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">🔐 Admin</p>
            </CardHeader>
            <CardContent className="space-y-4">
                <RoleGate allowedRole={UserRole.ADMIN}>
                    <FormSuccess message={`Welcome, ${role}!`} />
                </RoleGate>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">Admin-only API Route.</p>
                    <Button onClick={onAPIRouteClick}>Click to test</Button>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">
                        Admin-only Server Action.
                    </p>
                    <Button>Click to test</Button>
                </div>
            </CardContent>
        </Card>
    );
}
