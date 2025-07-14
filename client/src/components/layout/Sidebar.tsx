import { useState } from "react";
import { Search, Plus, LogOut, Filter, SortAsc, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { Category } from "@/config/types";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useSearchParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCategoriesApi } from "@/api/categories";
import MiniSpinner from "../MiniSpinner";
import { logoutApi } from "@/api/auth";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import axios from "axios";

interface SidebarProps {
  isMobile?: boolean;
}

const Sidebar = ({ isMobile }: SidebarProps) => {
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3b82f6");
  const { setUser, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "updatedAt";

  const { data: categoriesData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesApi,
  });

  const handleSortChange = (sort: string) => {
    searchParams.set("sortBy", sort);
    setSearchParams(searchParams);
  };

  const handleSelectCategory = (category: string | number) => {
    if (category === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", String(category));
    }
    setSearchParams(searchParams);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchParams.set("search", e.target.value);
    setSearchParams(searchParams);
  };

  const predefinedColors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
  ];

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

  if (isCategoryLoading) {
    return <MiniSpinner />;
  }

  const categories: Category[] = categoriesData.result || [];
  return (
    <div
      className={`bg-sidebar border-r border-sidebar-border flex flex-col ${isMobile ? "h-full" : "h-screen w-80"}`}
    >
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-sidebar-primary" />
            <h2 className="text-xl font-bold text-sidebar-foreground">
              LF Notes
            </h2>
          </div>
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={() => mutate()}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>

        <Button className="w-full mb-4" size={isMobile ? "default" : "sm"}>
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search notes..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SortAsc className="w-4 h-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt">Last Modified</SelectItem>
              <SelectItem value="createdAt">Date Created</SelectItem>
              <SelectItem value="titleAsc">Title (A-Z)</SelectItem>
              <SelectItem value="titleDesc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <Label className="flex items-center gap-2 text-sm font-medium text-sidebar-foreground">
            <Filter className="w-4 h-4" />
            Categories
          </Label>
          <Dialog
            open={isCreateCategoryOpen}
            onOpenChange={setIsCreateCategoryOpen}
          >
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category-name">Name</Label>
                  <Input
                    id="category-name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="category-color">Color</Label>
                  <div className="flex gap-2 mt-2">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewCategoryColor(color)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          newCategoryColor === color
                            ? "border-foreground"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateCategoryOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button>Create</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => handleSelectCategory("all")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              selectedCategory === "all"
                ? "bg-gray-200 text-sidebar-accent-foreground"
                : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="flex-1">All Notes</span>
          </button>

          {categories.map((category) => (
            <button
              onClick={() => handleSelectCategory(category.id)}
              key={category.id}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                selectedCategory === String(category.id)
                  ? "bg-gray-200 text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
              }`}
            >
              <div
                className="w-4 h-4 rounded-full"
                // style={{ backgroundColor: category.color }}
              />
              <span className="flex-1 truncate">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer for mobile */}
      {isMobile && (
        <>
          <Separator />
          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              disabled={isPending}
              onClick={() => mutate()}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
