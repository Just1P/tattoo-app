import { Badge } from "@/components/ui/badge";

interface PostTagsProps {
  tags: string[];
}

export function PostTags({ tags }: PostTagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <Badge key={index} variant="secondary">
          #{tag}
        </Badge>
      ))}
    </div>
  );
}
