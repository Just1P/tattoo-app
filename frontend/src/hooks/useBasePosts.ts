import { postsApi } from "@/lib/api/posts";
import {
  CreatePostData,
  Post,
  QueryPostsParams,
  UpdatePostData,
} from "@/lib/types/posts";
import { createErrorHandler } from "@/lib/utils/postUtils";
import { useCallback, useEffect, useState } from "react";

interface PaginationState {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UseBasePostsOptions {
  fetchFunction: (params?: QueryPostsParams) => Promise<{
    posts: Post[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  params?: QueryPostsParams;
}

export const useBasePosts = ({
  fetchFunction,
  params,
}: UseBasePostsOptions) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const handleError = useCallback((err: unknown, message: string) => {
    createErrorHandler(setError)(err, message);
  }, []);

  const fetchPosts = useCallback(
    async (queryParams?: QueryPostsParams) => {
      if (isLoading) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchFunction(queryParams || params);
        setPosts(response.posts);
        setPagination({
          total: response.total,
          page: response.page,
          limit: response.limit,
          totalPages: response.totalPages,
        });
        setHasFetched(true);
      } catch (err) {
        handleError(err, "Erreur inconnue");
        setHasFetched(true);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFunction, params, handleError, isLoading]
  );

  useEffect(() => {
    if (!hasFetched) {
      fetchPosts();
    }
  }, [fetchPosts, hasFetched]);

  const createPost = async (data: CreatePostData) => {
    try {
      const newPost = await postsApi.create(data);
      setPosts((prev) => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      handleError(err, "Erreur lors de la création");
    }
  };

  const updatePost = async (id: string, data: UpdatePostData) => {
    try {
      const updatedPost = await postsApi.update(id, data);
      setPosts((prev) =>
        prev.map((post) => (post.id === id ? updatedPost : post))
      );
      return updatedPost;
    } catch (err) {
      handleError(err, "Erreur lors de la mise à jour");
    }
  };

  const deletePost = async (id: string) => {
    try {
      await postsApi.delete(id);
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      handleError(err, "Erreur lors de la suppression");
    }
  };

  const likePost = async (id: string) => {
    try {
      const updatedPost = await postsApi.like(id);
      setPosts((prev) =>
        prev.map((post) => (post.id === id ? updatedPost : post))
      );
      return updatedPost;
    } catch (err) {
      handleError(err, "Erreur lors du like");
    }
  };

  const unlikePost = async (id: string) => {
    try {
      const updatedPost = await postsApi.unlike(id);
      setPosts((prev) =>
        prev.map((post) => (post.id === id ? updatedPost : post))
      );
      return updatedPost;
    } catch (err) {
      handleError(err, "Erreur lors du unlike");
    }
  };

  const refetch = useCallback(() => {
    setHasFetched(false);
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    isLoading,
    error,
    pagination,
    fetchPosts,
    refetch,
    createPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
  };
};
