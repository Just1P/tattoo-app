import { LoginFormData, RegisterFormData } from "@/lib/validations/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export const authApi = {
  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Erreur de connexion");
    }

    return response.json();
  },

  async register(
    data: Omit<RegisterFormData, "confirmPassword">
  ): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Erreur lors de l'inscription");
    }

    return response.json();
  },

  async logout(): Promise<void> {
    localStorage.removeItem("access_token");
  },
};
