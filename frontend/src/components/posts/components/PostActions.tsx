import { Button } from "@/components/ui/button";
import { postsApi } from "@/lib/api/posts";
import { useUser } from "@/lib/contexts/UserContext";
import { Post } from "@/lib/types/posts";
import { Heart, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PostActionsProps {
  post: Post;
  onLike?: (postId: string) => void;
  onUnlike?: (postId: string) => void;
}

export function PostActions({ post, onLike, onUnlike }: PostActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const liked = await postsApi.hasLiked(post.id);
        setIsLiked(liked);
      } catch {
        setIsLiked(false);
      }
    };

    checkLikeStatus();
  }, [post.id]);

  // Mettre à jour le compteur quand le post change
  useEffect(() => {
    setLikesCount(post.likesCount);
  }, [post.likesCount]);

  const handleLike = async () => {
    if (!user) {
      router.push("/auth");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isLiked) {
        await onUnlike?.(post.id);
        setIsLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1)); // Décrémenter localement
      } else {
        await onLike?.(post.id);
        setIsLiked(true);
        setLikesCount((prev) => prev + 1); // Incrémenter localement
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={isLoading}
          title={!user ? "Connectez-vous pour liker" : undefined}
          className={`flex items-center space-x-1 ${
            isLiked ? "text-red-500" : "text-gray-500"
          }`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          <span>{likesCount}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-1 text-gray-500"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{post.commentsCount}</span>
        </Button>
      </div>
    </div>
  );
}
