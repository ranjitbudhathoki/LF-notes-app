import _axios from "@/config/axios";
interface LoginCredentials {
  email: string;
  password: string;
}

export async function loginApi({ email, password }: LoginCredentials) {
  const { data } = await _axios.post("/auth/login", { email, password });
  return data;
}

export async function getCurrentUserApi() {
  const { data } = await _axios.get("/auth/me");
  return data;
}
