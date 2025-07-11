import useAuth from "@/hooks/useAuth";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();

  const { isAuthenticated, isLoading } = useAuth();

  console.log("is Authenticated", isAuthenticated);
  if (isLoading) return <div>Loading...</div>;

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
