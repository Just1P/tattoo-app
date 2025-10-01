export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  PROFILE_EDIT: "/profile/edit",
  DASHBOARD: "/dashboard",
} as const;

export const USER_TYPES = {
  CLIENT: "client",
  ARTIST: "artist",
} as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
];

export const AVATAR_MAX_SIZE = 400;
export const AVATAR_QUALITY = 0.8;
