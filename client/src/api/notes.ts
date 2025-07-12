import _axios from "@/config/axios";

export async function getNotesApi({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) {
  const { data } = await _axios.get("/notes", {
    params: { page, limit },
  });
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

export async function updateNoteApi(slug: string, payload: CreateNotePayload) {
  const { data } = await _axios.patch(`/notes/${slug}`, payload);
  return data;
}
