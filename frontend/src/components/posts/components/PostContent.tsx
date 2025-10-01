import { Post } from "@/lib/types/posts";

interface PostContentProps {
  post: Post;
}

export function PostContent({ post }: PostContentProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
      <p className="text-gray-700 whitespace-pre-wrap">{post.description}</p>
    </div>
  );
}
