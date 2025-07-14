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
import { XIcon, PencilIcon, PlusIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategoryApi,
  deleteCategoryApi,
  editCategoryApi,
} from "@/api/categories";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import type { Category } from "@/config/types";

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}
interface Inputs {
  categoryName: string;
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
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: { categoryName: "" },
  });

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

  const onSubmit = (data: Inputs) => {
    addCategory(data.categoryName.trim());
  };

  const { mutate: addCategory, isPending: isAdding } = useMutation({
    mutationFn: (categoryName: string) => createCategoryApi(categoryName),
    onSuccess: () => {
      toast.success("Category created successfully");
      invalidate();
      reset();
    },
  });

  const { mutate: deleteCategory, isPending: isDeleting } = useMutation({
    mutationFn: (categoryId: number) => deleteCategoryApi(categoryId),
    onSuccess: () => {
      toast.success("Category deleted successfully");

      invalidate();
      reset();
    },
  });

  const { mutate: editCategory } = useMutation({
    mutationFn: (data: { id: number; name: string }) => editCategoryApi(data),
    onSuccess: () => {
      toast.success("Category updated successfully");
      invalidate();
      setEditingCategoryId(null);
      setEditingCategoryName("");
    },
  });

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
            <DialogDescription>
              Add, edit, or delete your note categories.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-3">
            <div className="flex items-center space-x-2">
              <Input
                id="new-category"
                placeholder="New category name"
                {...register("categoryName", {
                  required: "Category name is required.",
                  minLength: {
                    value: 1,
                    message: "Category name must be at least 1 character.",
                  },
                  maxLength: {
                    value: 10,
                    message: "Category name cannot exceed 10 characters.",
                  },
                })}
                className="flex-1"
              />
              <Button size="icon" type="submit" disabled={isAdding}>
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>

            {errors.categoryName && (
              <p className="text-sm text-destructive">
                {errors.categoryName.message}
              </p>
            )}

            <div className="max-h-60 overflow-y-auto">
              {categories.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No categories added yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li
                      className="flex items-center justify-between rounded-md bg-muted p-2"
                      key={category.id}
                    >
                      {editingCategoryId === category.id ? (
                        <Input
                          value={editingCategoryName}
                          onChange={(e) => {
                            setEditingCategoryName(e.target.value);
                          }}
                          onBlur={handleEditSave}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleEditSave();
                            if (e.key === "Escape") setEditingCategoryId(null);
                          }}
                          className="flex-1 mr-2"
                          autoFocus
                        />
                      ) : (
                        <span className="flex-1">{category.name}</span>
                      )}
                      <div className="flex space-x-1">
                        {editingCategoryId !== category.id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditStart(category)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(category)}
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.name}</strong>? This action is
              irreversible.
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
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
