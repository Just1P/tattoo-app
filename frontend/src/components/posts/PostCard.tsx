"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Post } from "@/lib/types/posts";
import {
  PostActions,
  PostContent,
  PostHeader,
  PostImages,
  PostMeta,
  PostTags,
} from "./components";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onUnlike?: (postId: string) => void;
  showActions?: boolean;
  hideProfileButton?: boolean;
}

export function PostCard({
  post,
  onLike,
  onUnlike,
  showActions = true,
  hideProfileButton = false,
}: PostCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <PostHeader post={post} hideProfileButton={hideProfileButton} />
      </CardHeader>

      <CardContent className="space-y-4">
        <PostContent post={post} />

        {post.images && post.images.length > 0 && (
          <PostImages images={post.images} />
        )}

        {post.tags && post.tags.length > 0 && <PostTags tags={post.tags} />}

        <PostMeta post={post} />

        {showActions && (
          <PostActions post={post} onLike={onLike} onUnlike={onUnlike} />
        )}
      </CardContent>
    </Card>
  );
}
