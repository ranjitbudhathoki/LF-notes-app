import { logoutApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FileText, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function Header() {
  const { user, setUser, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: logoutApi,
    onSuccess: (data) => {
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
      toast.success(data.message);
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Unexpected error occurred");
      }
    },
  });

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 ">
        <div className="flex items-center justify-between h-16 ">
          <div className="flex items-center justify-center gap-3">
            <div className="flex-shrink-0">
              <div className="rounded-lg  bg-gray-900 p-3">
                <FileText className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 truncate">
                Leapfrog Notes
              </h1>
              <p className="text-sm text-gray-500 truncate">
                Welcome back, {user?.name}!
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => mutate()}
              disabled={isPending}
            >
              <LogOut className="h-5 w-5 " />
              <span className=" ml-2 hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
