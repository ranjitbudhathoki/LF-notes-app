import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategoriesApi } from "@/api/categories";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { createNoteApi } from "@/api/notes";
import axios from "axios";
import toast from "react-hot-toast";

interface Category {
  id: number;
  name: string;
  theme: string;
  createdAt: string;
  updatedAt: string;
}

interface Inputs {
  title: string;
  content: string;
  categoryIds: number[];
}

export default function CreateNoteForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      title: "",
      content: "",
      categoryIds: [],
    },
  });
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesApi,
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: Inputs) => createNoteApi(data),
    onSuccess: () => {
      toast.success("Note created successfully");
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
      navigate("/notes");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Unexpected error occurred");
      }
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Create New Note</h1>
          <div className="flex items-center gap-2">
            <p className="text-gray-600">
              Capture your thoughts and organize them with categories
            </p>
          </div>
        </div>

        <Link
          to="/notes"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Notes
        </Link>

        <Card className="shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">Create New Note</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Title
                </label>
                <Input
                  placeholder="Enter a descriptive title..."
                  className="text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 1,

                      message: "Title must be at least 1 characters long",
                    },
                  })}
                />

                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Content
                </label>
                <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                  <Controller
                    name="content"
                    control={control}
                    rules={{
                      required: "Content is required",
                      validate: (value) =>
                        value.replace(/<(.|\n)*?>/g, "").trim().length > 0 ||
                        "Content cannot be empty",
                    }}
                    render={({ field }) => (
                      <ReactQuill
                        theme="snow"
                        className="h-72"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.content.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Categories
                  </h3>
                  <p className="text-sm text-gray-500">
                    Organize your note with relevant categories
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Available Categories
                  </p>
                  <Controller
                    name="categoryIds"
                    control={control}
                    rules={{
                      validate: (value) =>
                        value.length >= 1 ||
                        "At least one category must be selected",
                    }}
                    render={({ field }) => (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {categoriesData.result.map((category: Category) => (
                          <div
                            key={category.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`category-${category.id}`}
                              checked={field.value.includes(category.id)}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...field.value, category.id]
                                  : field.value.filter(
                                      (id) => id !== category.id,
                                    );
                                field.onChange(newValue);
                              }}
                            />
                            <label
                              htmlFor={`category-${category.id}`}
                              className={`text-sm cursor-pointer bg-${category.theme} font-medium`}
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                  {errors.categoryIds && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.categoryIds.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className=" text-white px-6"
                  disabled={isPending}
                >
                  {isPending ? "Creating Note..." : "Create Note"}
                </Button>

                <Link to="/notes">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
