import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  XIcon,
  PencilIcon,
  CheckIcon,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategoryApi,
  deleteCategoryApi,
  editCategoryApi,
} from "@/api/categories";
import toast from "react-hot-toast";
import type { Category } from "@/config/types";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

export default function CategoryManager({
  isOpen,
  onClose,
  categories,
}: CategoryManagerProps) {
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null,
  );
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3b82f6");

  const queryClient = useQueryClient();

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

  const handleEditStart = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    queryClient.invalidateQueries({ queryKey: ["notes"] });
  };

  const handleEditSave = () => {
    if (editingCategoryId && editingCategoryName.trim()) {
      editCategory({ id: editingCategoryId, name: editingCategoryName.trim() });
    }
  };

  const confirmDeleteCategory = () => {
    if (!deleteTarget) return;
    deleteCategory(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      addCategory();
    }
  };

  const { mutate: addCategory, isPending: isAdding } = useMutation({
    mutationFn: () =>
      createCategoryApi({
        categoryName: newCategoryName.trim(),
        theme: newCategoryColor,
      }),
    onSuccess: () => {
      toast.success("Category created successfully");
      invalidate();

      setNewCategoryName("");
      setNewCategoryColor("#3b82f6");
    },
    onError: (error: unknown) => {
      console.log("error", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Unexpected error occurred");
      }
    },
  });

  const { mutate: deleteCategory, isPending: isDeleting } = useMutation({
    mutationFn: (categoryId: number) => deleteCategoryApi(categoryId),
    onSuccess: () => {
      toast.success("Category deleted successfully");
      invalidate();
    },
    onError: (error: unknown) => {
      console.log("error", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Unexpected error occurred");
      }
    },
  });

  const { mutate: editCategory, isPending: isEditing } = useMutation({
    mutationFn: (data: { id: number; name: string }) => editCategoryApi(data),
    onSuccess: () => {
      toast.success("Category updated successfully");
      invalidate();
      setEditingCategoryId(null);
      setEditingCategoryName("");
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
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
            <DialogDescription>
              Add, edit, or delete your note categories.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Create New Category Section */}
            <div className="space-y-4">
              <div className="space-y-3 m">
                <div>
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="category-color">Color</Label>
                  <div className="flex gap-2 mt-2">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewCategoryColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          newCategoryColor === color
                            ? "border-foreground scale-110"
                            : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleCreateCategory}
                  disabled={isAdding || !newCategoryName.trim()}
                  className="w-full"
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Category
                    </>
                  )}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Existing Categories Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Existing Categories</h3>
              <div className="max-h-60 overflow-y-auto">
                {categories.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No categories added yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        className="flex items-center justify-between rounded-md bg-muted p-3"
                        key={category.id}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.theme }}
                          />

                          {editingCategoryId === category.id ? (
                            <Input
                              value={editingCategoryName}
                              onChange={(e) =>
                                setEditingCategoryName(e.target.value)
                              }
                              className="flex-1"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleEditSave();
                                }
                                if (e.key === "Escape") {
                                  setEditingCategoryId(null);
                                  setEditingCategoryName("");
                                }
                              }}
                            />
                          ) : (
                            <span className="font-medium">{category.name}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {editingCategoryId === category.id ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleEditSave}
                                disabled={isEditing}
                              >
                                <CheckIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingCategoryId(null);
                                  setEditingCategoryName("");
                                }}
                              >
                                <XIcon className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditStart(category)}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteTarget(category)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.name}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteCategory}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
