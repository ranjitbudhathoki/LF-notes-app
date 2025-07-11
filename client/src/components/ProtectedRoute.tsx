import useAuth from "@/hooks/useAuth";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  console.log("protected route called");
  const location = useLocation();

  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full bg-white items-center justify-center">
        <div className="h-16 w-16 animate-spin text-gray-900 rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace={true}
        state={{ from: { pathname: location.pathname } }}
      />
    );
  }
  return <>{children}</>;
}
