import _axios from "@/config/axios";
interface LoginCredentials {
  email: string;
  password: string;
}
interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
}
export async function loginApi({ email, password }: LoginCredentials) {
  const { data } = await _axios.post("/auth/login", { email, password });
  return data;
}

export async function signUpApi({ name, email, password }: SignUpCredentials) {
  const { data } = await _axios.post("/auth/signup", { name, email, password });
  return data;
}

export async function getCurrentUserApi() {
  const { data } = await _axios.get("/auth/me");
  return data;
}
