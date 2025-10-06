import { API_BASE_URL } from "@/lib/constants";
import {
  ApiError,
  CreatePostData,
  Post,
  PostsResponse,
  QueryPostsParams,
  UpdatePostData,
} from "@/lib/types/posts";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const getAuthHeadersForUpload = () => {
  const token = localStorage.getItem("access_token");
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const postsApi = {
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE_URL}/posts/upload`, {
      method: "POST",
      headers: getAuthHeadersForUpload(),
      body: formData,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Erreur lors de l'upload de l'image");
    }

    const result = await response.json();
    return result.url;
  },

  async create(data: CreatePostData): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Erreur lors de la création du post");
    }

    return response.json();
  },

  async findAll(params?: QueryPostsParams): Promise<PostsResponse> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/posts?${searchParams.toString()}`
    );

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(
        error.message || "Erreur lors de la récupération des posts"
      );
    }

    return response.json();
  },

  async findOne(id: string): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`);

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Post non trouvé");
    }

    return response.json();
  },

  async findByAuthor(
    authorId: string,
    params?: QueryPostsParams
  ): Promise<PostsResponse> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/posts/author/${authorId}?${searchParams.toString()}`
    );

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(
        error.message || "Erreur lors de la récupération des posts"
      );
    }

    return response.json();
  },

  async findMyPosts(params?: QueryPostsParams): Promise<PostsResponse> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/posts/my-posts?${searchParams.toString()}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(
        error.message || "Erreur lors de la récupération de vos posts"
      );
    }

    return response.json();
  },

  async update(id: string, data: UpdatePostData): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Erreur lors de la mise à jour du post");
    }

    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Erreur lors de la suppression du post");
    }
  },

  async like(id: string): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}/like`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Erreur lors du like");
    }

    return response.json();
  },

  async unlike(id: string): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}/unlike`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Erreur lors du unlike");
    }

    return response.json();
  },

  async hasLiked(id: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}/liked`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.hasLiked;
  },

  async getPopular(limit?: number): Promise<Post[]> {
    const searchParams = new URLSearchParams();
    if (limit) {
      searchParams.append("limit", limit.toString());
    }

    const response = await fetch(
      `${API_BASE_URL}/posts/popular?${searchParams.toString()}`
    );

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(
        error.message || "Erreur lors de la récupération des posts populaires"
      );
    }

    return response.json();
  },

  async getRecent(limit?: number): Promise<Post[]> {
    const searchParams = new URLSearchParams();
    if (limit) {
      searchParams.append("limit", limit.toString());
    }

    const response = await fetch(
      `${API_BASE_URL}/posts/recent?${searchParams.toString()}`
    );

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(
        error.message || "Erreur lors de la récupération des posts récents"
      );
    }

    return response.json();
  },
};
