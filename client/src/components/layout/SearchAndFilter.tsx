import { Search, Plus, Tag, ArrowUpDown, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const categories = [
  { id: 1, name: "Urgent", color: "bg-red-500", count: 2 },
  { id: 2, name: "Meeting", color: "bg-blue-500", count: 2 },
  { id: 3, name: "Research", color: "bg-green-500", count: 4 },
  { id: 4, name: "Creative", color: "bg-purple-500", count: 3 },
  { id: 5, name: "Planning", color: "bg-orange-500", count: 4 },
  { id: 6, name: "Review", color: "bg-pink-500", count: 2 },
];

interface SearchBarProps {
  onFiltersChange?: (selectedCategories: Set<number>) => void;
}

export default function SearchAndFilter({ onFiltersChange }: SearchBarProps) {
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(
    new Set(),
  );

  const getSelectedCategoryNames = () => {
    return categories.filter((cat) => selectedCategories.has(cat.id));
  };

  const getDropdownLabel = () => {
    const selectedCount = selectedCategories.size;
    if (selectedCount === 0) return "All Categories";
    if (selectedCount === 1) return getSelectedCategoryNames()[0].name;
    return `${selectedCount} Categories`;
  };

  const getTotalFilteredNotes = () => {
    if (selectedCategories.size === 0) {
      return categories.reduce((total, cat) => total + cat.count, 0);
    }
    return getSelectedCategoryNames().reduce(
      (total, cat) => total + cat.count,
      0,
    );
  };

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      onFiltersChange?.(newSet);
      return newSet;
    });
  };

  const handleClearAllCategories = () => {
    const newSet = new Set<number>();
    setSelectedCategories(newSet);
    onFiltersChange?.(newSet);
  };

  const handleRemoveCategory = (categoryId: number) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      newSet.delete(categoryId);
      onFiltersChange?.(newSet);
      return newSet;
    });
  };

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes, content, categories..."
            className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button className="text-white rounded-full px-3 py-2 sm:px-4 sm:py-2.5 whitespace-nowrap text-sm">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">New Note</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full px-3 py-2 sm:px-4 sm:py-2.5 whitespace-nowrap bg-transparent relative text-sm"
              >
                <Tag className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{getDropdownLabel()}</span>
                <span className="sm:hidden">
                  {selectedCategories.size === 0
                    ? "All"
                    : selectedCategories.size.toString()}
                </span>
                <ChevronDown className="h-4 w-4 ml-1 sm:ml-2" />

                {selectedCategories.size > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                    {selectedCategories.size}
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 p-2">
              <div className="flex items-center justify-between px-3 py-2 mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Filter by Categories
                </span>
                {selectedCategories.size > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAllCategories}
                    className="text-xs text-gray-500 hover:text-gray-700 h-auto p-1"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              <DropdownMenuSeparator className="my-2" />

              {categories.map((category) => (
                <DropdownMenuItem
                  key={category.id}
                  className="flex items-center justify-between py-2 px-3 rounded-md cursor-pointer"
                  onSelect={(e) => {
                    e.preventDefault();
                    handleCategoryToggle(category.id);
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox
                      checked={selectedCategories.has(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <div
                      className={`w-3 h-3 rounded-sm ${category.color}`}
                    ></div>
                    <span className="flex-1">{category.name}</span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator className="my-2" />

              <DropdownMenuItem className="flex items-center gap-3 py-2 px-3 rounded-md text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                <Plus className="h-4 w-4" />
                <span>Manage Categories</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Dropdown - Responsive */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full px-3 py-2 sm:px-4 sm:py-2.5 whitespace-nowrap bg-transparent text-sm"
              >
                <ArrowUpDown className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Sort</span>
                <ChevronDown className="h-4 w-4 ml-1 sm:ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem>Date Created</DropdownMenuItem>
              <DropdownMenuItem>Date Modified</DropdownMenuItem>
              <DropdownMenuItem>Alplabetical A-Z</DropdownMenuItem>
              <DropdownMenuItem>Alphabetical Z-A</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Applied Filters Section - Below the buttons (same as before) */}
      <div className="min-h-[2.5rem] transition-all duration-200 ease-in-out">
        <div
          className={`transform transition-all duration-200 ease-in-out ${
            selectedCategories.size > 0
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Filtered by:</span>
              {getSelectedCategoryNames().map((category) => (
                <Badge
                  key={category.name}
                  variant="secondary"
                  className="flex items-center gap-1 pr-1 text-xs"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${category.color}`}
                  ></div>
                  {category.name}
                  <button
                    onClick={() => handleRemoveCategory(category.id)}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAllCategories}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear all
              </Button>
            </div>
            <div className="text-sm text-gray-500 self-start sm:self-auto">
              {getTotalFilteredNotes()}{" "}
              {getTotalFilteredNotes() === 1 ? "note" : "notes"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
