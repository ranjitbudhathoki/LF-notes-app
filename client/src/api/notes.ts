import _axios from "@/config/axios";

interface GetNotesPayload {
  page?: number;
  limit?: number;
  category?: string;
  sortBy?: string;
  search?: string;
}

interface CreateNotePayload {
  title: string;
  content: string;
  categoryIds: number[];
}

export async function getNotesApi({
  page = 1,
  limit = 10,
  category = "all",
  sortBy = "updatedAt",
  search = "",
}: GetNotesPayload) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (category && category !== "all") {
    params.append("categoryId", category);
  }
  if (sortBy && sortBy !== "updatedAt") {
    params.append("sortBy", sortBy);
  }
  if (search) {
    params.append("search", search);
  }

  console.log({ params });
  const { data } = await _axios.get("/notes", {
    params,
  });
  return data;
}

interface GetPinnedNotesPayload {
  category?: string;
}

export async function getPinnedNotesApi({
  category = "all",
}: GetPinnedNotesPayload) {
  const params = new URLSearchParams();

  if (category && category !== "all") {
    params.append("categoryId", category);
  }

  console.log({ params });
  const { data } = await _axios.get("/notes/pinned", {
    params,
  });
  return data;
}

export async function togglePinNoteApi(noteId: number) {
  const { data } = await _axios.patch(`/notes/${noteId}/pin`);
  return data;
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
