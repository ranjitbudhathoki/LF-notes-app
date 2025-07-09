import { Button } from "@/components/ui/button";
import { FileText, LogOut } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto py-4 flex items-center justify-between">
        <div className="flex items-center justify-center  gap-3">
          <div className="bg-green-700 rounded-full p-3">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-green-700">
              Leapfrog Notes
            </h1>
            <p className="text-sm text-gray-500">Welcome back, Ranjit!</p>
          </div>
        </div>

        <div className="flex ">
          <LogOut className="h-5 w-5" />
        </div>
      </div>
    </header>
  );
}
