import { Button } from "@/components/ui/button";
import { Post } from "@/lib/types/posts";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";

interface PostActionsProps {
  post: Post;
  onLike?: (postId: string) => void;
  onUnlike?: (postId: string) => void;
}

export function PostActions({ post, onLike, onUnlike }: PostActionsProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      onUnlike?.(post.id);
      setIsLiked(false);
    } else {
      onLike?.(post.id);
      setIsLiked(true);
    }
  };

  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`flex items-center space-x-1 ${
            isLiked ? "text-red-500" : "text-gray-500"
          }`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          <span>{post.likesCount}</span>
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
