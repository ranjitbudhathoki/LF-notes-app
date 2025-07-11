import _axios from "@/config/axios";

export async function getCategoriesApi() {
  const { data } = await _axios.get("/categories");
  return data;
}
