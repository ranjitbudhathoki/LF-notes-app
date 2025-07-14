import useAuth from "@/hooks/useAuth";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import Loader from "./Loader";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  console.log("protected route called");
  const location = useLocation();

  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace={true}
        state={{ from: location.pathname }}
      />
    );
  }
  return <>{children}</>;
}
