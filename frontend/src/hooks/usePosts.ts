import { postsApi } from "@/lib/api/posts";
import { Post, QueryPostsParams } from "@/lib/types/posts";
import { createErrorHandler } from "@/lib/utils/postUtils";
import { useCallback, useEffect, useState } from "react";
import { useBasePosts } from "./useBasePosts";

export const usePosts = (params?: QueryPostsParams) => {
  return useBasePosts({
    fetchFunction: postsApi.findAll,
    params,
  });
};

export const useMyPosts = (params?: QueryPostsParams) => {
  const baseHook = useBasePosts({
    fetchFunction: postsApi.findMyPosts,
    params,
  });

  return {
    ...baseHook,
    fetchMyPosts: baseHook.fetchPosts,
    refetchMyPosts: baseHook.refetch,
  };
};

export const usePost = (id: string) => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = createErrorHandler(setError);

  const fetchPost = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const postData = await postsApi.findOne(id);
      setPost(postData);
    } catch (err) {
      handleError(err, "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  }, [id, handleError]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return {
    post,
    isLoading,
    error,
    refetch: fetchPost,
  };
};
