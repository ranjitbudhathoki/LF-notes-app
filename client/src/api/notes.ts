import _axios from "@/config/axios";

export async function getNotesApi() {
  const { data } = await _axios.get("/notes");
  return data;
}
