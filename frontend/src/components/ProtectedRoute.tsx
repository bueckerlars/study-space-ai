import type { PropsWithChildren } from "react";
import { User } from "../../../shared/types/User";
import { useAuth } from "@/provider/AuthProvider";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = PropsWithChildren & {
    allowedRoles?: User['role'][];
};

export default function ProtectedRoute({ 
    allowedRoles,
    children
}: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    if (loading) {
        return <div>Loading</div>;
    }

    if (
        user === null ||
        (allowedRoles && !allowedRoles.includes(user!.role))
    ){
        return <Navigate to="/login" />;
    }
    
    return children;
}
