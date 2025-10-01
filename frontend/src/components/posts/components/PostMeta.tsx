import { Post } from "@/lib/types/posts";
import { formatPriceWithCurrency } from "@/lib/utils/price";
import { Euro, MapPin } from "lucide-react";

interface PostMetaProps {
  post: Post;
}

export function PostMeta({ post }: PostMetaProps) {
  return (
    <div className="flex items-center justify-between text-sm text-gray-500">
      <div className="flex items-center space-x-4">
        {post.location && (
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{post.location}</span>
          </div>
        )}
        {formatPriceWithCurrency(post.price) && (
          <div className="flex items-center space-x-1">
            <Euro className="h-4 w-4" />
            <span>{formatPriceWithCurrency(post.price)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
