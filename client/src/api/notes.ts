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

export async function getNoteBySlugApi(slug: string) {
  const { data } = await _axios.get(`/notes/${slug}`);
  return data;
}

export async function deleteNoteApi(slug: string) {
  const { data } = await _axios.delete(`/notes/${slug}`);
  return data;
}

export async function updateNoteApi(id: number, payload: CreateNotePayload) {
  const { data } = await _axios.put(`/notes/${id}`, payload);
  return data;
}
