"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Post } from "@/lib/types/posts";
import { getInitials } from "@/lib/utils/image";
import {
  formatPostDate,
  getCategoryLabel,
  getStatusColor,
  getStatusLabel,
} from "@/lib/utils/postUtils";
import { IconUser } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface PostHeaderProps {
  post: Post;
}

export function PostHeader({ post }: PostHeaderProps) {
  const router = useRouter();

  const handleViewProfile = () => {
    router.push(`/artist/${post.author.id}`);
  };

  const displayName =
    post.author.firstName && post.author.lastName
      ? `${post.author.firstName} ${post.author.lastName}`
      : post.author.email;

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3 flex-1">
        <Avatar
          className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
          onClick={handleViewProfile}
        >
          {post.author.avatar && (
            <AvatarImage
              src={post.author.avatar.replace(
                "localhost:3000",
                "localhost:3001"
              )}
              alt={displayName}
            />
          )}
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials(post.author.firstName, post.author.lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <button
            onClick={handleViewProfile}
            className="font-semibold text-gray-900 hover:text-primary transition-colors text-left"
          >
            {displayName}
          </button>
          <p className="text-sm text-gray-500">
            {formatPostDate(post.createdAt)}
          </p>
        </div>
        {post.author.userType === "artist" && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewProfile}
            className="hidden md:flex"
          >
            <IconUser className="h-4 w-4 mr-1" />
            Voir le profil
          </Button>
        )}
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
