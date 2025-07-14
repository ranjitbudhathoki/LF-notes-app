import { getCategoriesApi } from "@/api/categories";
import Sidebar from "@/components/layout/Sidebar";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router";

export default function Layout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const { data: categoriesData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesApi,
  });

  if (isCategoryLoading) {
    return <Loader />;
  }
  const categories = categoriesData.result || [];

  return (
    <main className="min-h-screen w-full bg-gray-50">
      <div className="flex h-screen bg-background">
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
          <Sheet
            open={isMobileSidebarOpen}
            onOpenChange={setIsMobileSidebarOpen}
          >
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <Sidebar categories={categories} isMobile={true} />
            </SheetContent>
          </Sheet>

          <h1 className="text-lg font-semibold">Notes</h1>
          <Button variant="default" size="sm">
            New Note
          </Button>
        </div>

        <div className="hidden md:block">
          <Sidebar categories={categories} isMobile={false} />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <Outlet />
      </div>
    </main>
  );
}
