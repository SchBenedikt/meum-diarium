import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { CalendarDays } from "lucide-react";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === post.imageId);

  return (
    <Link href={`/posts/${post.id}`} className="flex">
      <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg w-full">
        <CardHeader className="p-0">
          {image && (
            <div className="aspect-video overflow-hidden">
              <Image
                src={image.imageUrl}
                alt={image.description}
                width={800}
                height={600}
                data-ai-hint={image.imageHint}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="flex flex-1 flex-col p-6">
          <Badge
            variant={post.type === "diary" ? "default" : "secondary"}
            className="mb-2 w-fit"
          >
            {post.type === "diary" ? "Tagebuch" : "Wissenschaft"}
          </Badge>
          <CardTitle className="mb-2 font-headline text-xl">
            {post.title}
          </CardTitle>
          <CardDescription className="flex-1">{post.excerpt}</CardDescription>
        </CardContent>
        <CardFooter>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>{post.date}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
