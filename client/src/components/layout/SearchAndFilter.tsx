import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus } from "lucide-react";

import CategoryManager from "@/features/categories/ManageCategories";
interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function SearchAndFilter({
  categories,
}: {
  categories: Category[];
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("soryBy") || "updatedAt",
  );
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  const updateSearchParams = (newCategory: string, newSortBy: string) => {
    const params = new URLSearchParams();
    if (newCategory && newCategory !== "all") {
      params.set("category", newCategory);
    }
    if (newSortBy && newSortBy !== "updatedAt") {
      params.set("sortBy", newSortBy);
    }
    setSearchParams(params);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    updateSearchParams(value, sortBy);
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value);
    updateSearchParams(selectedCategory, value);
  };

  return (
    <>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:flex-wrap justify-end">
          <div className="relative flex-1 min-w-[200px] max-w-full md:max-w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search notes..."
              className="w-full pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 w-full md:w-auto">
            <Select value={sortBy} onValueChange={handleSortByChange}>
              <SelectTrigger className="flex-1 min-w-[120px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updatedAt">Last Modified</SelectItem>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="titleAsc">Title A-Z</SelectItem>
                <SelectItem value="titleDesc">Title Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => setIsCategoryManagerOpen(true)}
            className="w-full md:w-auto"
            variant="outline"
          >
            Manage Categories
          </Button>

          <Button
            className="w-full md:w-auto"
            onClick={() => navigate("/notes/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Note
          </Button>
        </div>
        <CategoryManager
          isOpen={isCategoryManagerOpen}
          onClose={() => setIsCategoryManagerOpen(false)}
          categories={categories}
        />
      </div>
    </>
  );
}
