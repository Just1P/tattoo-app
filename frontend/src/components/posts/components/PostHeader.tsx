import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/lib/types/posts";
import { getInitials } from "@/lib/utils/image";
import {
  formatPostDate,
  getCategoryLabel,
  getStatusColor,
  getStatusLabel,
} from "@/lib/utils/postUtils";

interface PostHeaderProps {
  post: Post;
}

export function PostHeader({ post }: PostHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          {post.author.avatar && (
            <AvatarImage
              src={post.author.avatar.replace(
                "localhost:3000",
                "localhost:3001"
              )}
              alt={post.author.email}
            />
          )}
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials(post.author.firstName, post.author.lastName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-900">
            {post.author.firstName && post.author.lastName
              ? `${post.author.firstName} ${post.author.lastName}`
              : post.author.email}
          </h3>
          <p className="text-sm text-gray-500">
            {formatPostDate(post.createdAt)}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <Badge variant="outline">{getCategoryLabel(post.category)}</Badge>
        <Badge className={getStatusColor(post.status)}>
          {getStatusLabel(post.status)}
        </Badge>
      </div>
    </div>
  );
}
