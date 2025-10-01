const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface ProfileData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  instagram?: string;
  userType: "client" | "artist";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  instagram?: string;
  userType?: "client" | "artist";
}

class ProfileApi {
  private async getAuthHeaders() {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async getProfile(): Promise<ProfileData> {
    try {
      const headers = await this.getAuthHeaders();
      console.log("Headers:", headers);
      console.log("API URL:", `${API_BASE_URL}/profile`);

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "GET",
        headers,
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const error = await response.json();
        console.error("API Error:", error);
        throw new Error(
          error.message || "Erreur lors de la récupération du profil"
        );
      }

      const data = await response.json();
      console.log("Profile data:", data);
      return data;
    } catch (error) {
      console.error("getProfile error:", error);
      throw error;
    }
  }

  async updateProfile(data: UpdateProfileData): Promise<ProfileData> {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "PUT",
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Erreur lors de la mise à jour du profil"
      );
    }

    return response.json();
  }

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append("avatar", file);

    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    const response = await fetch(`${API_BASE_URL}/profile/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erreur lors de l'upload de l'avatar");
    }

    return response.json();
  }
}

export const profileApi = new ProfileApi();
