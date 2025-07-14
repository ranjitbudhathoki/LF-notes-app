import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router";

export default function Layout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen w-full bg-gray-50">
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            <Sidebar isMobile={true} />
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold">Notes</h1>
        <Button variant="default" size="sm">
          New Note
        </Button>
      </div>

      {/* Main content area */}
      <div className="flex h-screen pt-16 md:pt-0">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar isMobile={false} />
        </div>

        {/* Main content outlet */}
        <div className="flex-1 overflow-auto ">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
