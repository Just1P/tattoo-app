export interface Post {
  id: string;
  title: string;
  description: string;
  images?: string[];
  tags?: string[];
  category: "tattoo" | "flash" | "inspiration" | "other";
  isPublic: boolean;
  likesCount: number;
  commentsCount: number;
  location?: string;
  price?: number;
  status: "available" | "booked" | "completed";
  authorId: string;
  author: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    avatar?: string;
    userType: "client" | "artist";
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  title: string;
  description: string;
  images?: string[];
  tags?: string[];
  category?: "tattoo" | "flash" | "inspiration" | "other";
  isPublic?: boolean;
  location?: string;
  price?: number;
  status?: "available" | "booked" | "completed";
}

export type UpdatePostData = Partial<CreatePostData>;

export interface QueryPostsParams {
  search?: string;
  category?: "tattoo" | "flash" | "inspiration" | "other";
  authorId?: string;
  status?: "available" | "booked" | "completed";
  location?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "likesCount" | "commentsCount";
  sortOrder?: "ASC" | "DESC";
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export const POST_CATEGORIES = {
  TATTOO: "tattoo",
  FLASH: "flash",
  INSPIRATION: "inspiration",
  OTHER: "other",
} as const;

export const POST_STATUS = {
  AVAILABLE: "available",
  BOOKED: "booked",
  COMPLETED: "completed",
} as const;

export const POST_SORT_OPTIONS = {
  CREATED_AT: "createdAt",
  LIKES_COUNT: "likesCount",
  COMMENTS_COUNT: "commentsCount",
} as const;
