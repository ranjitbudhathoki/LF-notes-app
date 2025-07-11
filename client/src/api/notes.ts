import _axios from "@/config/axios";

export async function getNotesApi() {
  const { data } = await _axios.get("/notes");
  return data;
}
interface CreateNotePayload {
  title: string;
  content: string;
  categoryIds: number[];
}
export async function createNoteApi(payload: CreateNotePayload) {
  const { data } = await _axios.post("/notes", payload);
  return data;
}
