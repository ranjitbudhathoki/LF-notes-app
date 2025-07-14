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

// interface SidebarProps {
//   categories: Category[];
//   selectedCategory: string;
//   onSelectCategory: (categoryId: string) => void;
//   onCreateCategory: (name: string, color: string) => void;
//   onNewNote: () => void;
//   onLogout: () => void;
//   searchQuery: string;
//   onSearchChange: (query: string) => void;
//   sortBy: "date" | "title" | "modified";
//   onSortChange: (sort: "date" | "title" | "modified") => void;
//   searchInputRef: React.RefObject<HTMLInputElement>;
//   isMobile?: boolean;
// }

interface SidebarProps {
  categories: Category[];
  isMobile?: boolean;
}

const Sidebar = ({ categories, isMobile }: SidebarProps) => {
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3b82f6");

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

  return (
    <div
      className={`bg-sidebar border-r border-sidebar-border flex flex-col ${isMobile ? "h-full" : "h-screen w-80"}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-sidebar-primary" />
            <h2 className="text-xl font-bold text-sidebar-foreground">
              LF Notes
            </h2>
          </div>
          {!isMobile && (
            <Button variant="ghost" size="sm">
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* New Note Button */}
        <Button className="w-full mb-4" size={isMobile ? "default" : "sm"}>
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input type="text" placeholder="Search notes..." className="pl-10" />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SortAsc className="w-4 h-4 text-muted-foreground" />
          <Select>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modified">Last Modified</SelectItem>
              <SelectItem value="date">Date Created</SelectItem>
              <SelectItem value="title">Title</SelectItem>
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
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors `}
          >
            <FileText className="w-4 h-4" />
            <span className="flex-1">All Notes</span>
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                  "hover:bg-sidebar-accent/50 text-sidebar-foreground"
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
            <Button variant="ghost" className="w-full justify-start">
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
