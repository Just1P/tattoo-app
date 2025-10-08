import { useWebSocket } from "@/lib/contexts/WebSocketContext";
import { Post } from "@/lib/types/posts";
import { useCallback, useEffect } from "react";

interface PostLikeEvent {
  postId: string;
  userId: string;
  likesCount: number;
  timestamp: string;
}

interface PostCreatedEvent {
  post: Post;
  timestamp: string;
}

interface PostUpdatedEvent {
  post: Post;
  timestamp: string;
}

interface PostDeletedEvent {
  postId: string;
  timestamp: string;
}

export const useWebSocketPosts = (
  onPostLiked?: (data: PostLikeEvent) => void,
  onPostUnliked?: (data: PostLikeEvent) => void,
  onPostCreated?: (data: PostCreatedEvent) => void,
  onPostUpdated?: (data: PostUpdatedEvent) => void,
  onPostDeleted?: (data: PostDeletedEvent) => void
) => {
  const { on, off, isConnected } = useWebSocket();

  const handlePostLiked = useCallback(
    (data: unknown) => {
      const event = data as PostLikeEvent;
      console.log("🔔 Post liké:", event);
      onPostLiked?.(event);
    },
    [onPostLiked]
  );

  const handlePostUnliked = useCallback(
    (data: unknown) => {
      const event = data as PostLikeEvent;
      console.log("🔔 Post unliké:", event);
      onPostUnliked?.(event);
    },
    [onPostUnliked]
  );

  const handlePostCreated = useCallback(
    (data: unknown) => {
      const event = data as PostCreatedEvent;
      console.log("🔔 Nouveau post:", event);
      onPostCreated?.(event);
    },
    [onPostCreated]
  );

  const handlePostUpdated = useCallback(
    (data: unknown) => {
      const event = data as PostUpdatedEvent;
      console.log("🔔 Post mis à jour:", event);
      onPostUpdated?.(event);
    },
    [onPostUpdated]
  );

  const handlePostDeleted = useCallback(
    (data: unknown) => {
      const event = data as PostDeletedEvent;
      console.log("🔔 Post supprimé:", event);
      onPostDeleted?.(event);
    },
    [onPostDeleted]
  );

  useEffect(() => {
    if (!isConnected) return;

    on("post:liked", handlePostLiked);
    on("post:unliked", handlePostUnliked);
    on("post:created", handlePostCreated);
    on("post:updated", handlePostUpdated);
    on("post:deleted", handlePostDeleted);

    return () => {
      off("post:liked", handlePostLiked);
      off("post:unliked", handlePostUnliked);
      off("post:created", handlePostCreated);
      off("post:updated", handlePostUpdated);
      off("post:deleted", handlePostDeleted);
    };
  }, [
    isConnected,
    on,
    off,
    handlePostLiked,
    handlePostUnliked,
    handlePostCreated,
    handlePostUpdated,
    handlePostDeleted,
  ]);

  return { isConnected };
};
