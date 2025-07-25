import _axios from "@/config/axios";

export async function getCategoriesApi() {
  const { data } = await _axios.get("/categories");
  return data;
}

interface CreateCategoryParams {
  categoryName: string;
  theme: string;
}

export async function createCategoryApi({
  categoryName,
  theme,
}: CreateCategoryParams) {
  const { data } = await _axios.post("/categories", {
    name: categoryName,
    theme,
  });
  return data;
}

export async function deleteCategoryApi(categoryId: number) {
  const { data } = await _axios.delete(`/categories/${categoryId}`);
  return data;
}

export async function editCategoryApi({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const { data } = await _axios.patch(`/categories/${id}`, {
    name,
  });
  return data;
}
