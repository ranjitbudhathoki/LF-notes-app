import _axios from "@/config/axios";
interface LoginCredentials {
  email: string;
  password: string;
}

export async function login({ email, password }: LoginCredentials) {
  const { data } = await _axios.post("/login", { email, password });
  return data;
}
