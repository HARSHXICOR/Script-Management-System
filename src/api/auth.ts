import type { AuthResponse, LoginRequest, SignupRequest, User } from "../types/auth";
import { get, post, setStoredToken } from "./client";

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const res = await post<AuthResponse>("/auth/login", credentials);
    if (res.token) {
      setStoredToken(res.token);
    }
    return res;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const res = await post<AuthResponse>("/auth/signup", data);
    if (res.token) {
      setStoredToken(res.token);
    }
    return res;
  },

  me: async (): Promise<User> => {
    return get<User>("/auth/me");
  },

  logout: (): void => {
    setStoredToken(null);
  },
};
