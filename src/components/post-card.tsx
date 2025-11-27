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
import { CalendarDays, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === post.imageId);

  return (
    <Link href={`/posts/${post.id}`} className="group flex">
      <Card className="flex w-full flex-col overflow-hidden rounded-xl border-2 shadow-sm transition-all hover:border-primary hover:shadow-lg">
        {image && (
          <CardHeader className="p-0">
            <div className="aspect-[4/3] overflow-hidden">
              <Image
                src={image.imageUrl}
                alt={image.description}
                width={800}
                height={600}
                data-ai-hint={image.imageHint}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </CardHeader>
        )}
        <CardContent className="flex flex-1 flex-col p-4">
          <Badge
            variant={post.type === "diary" ? "default" : "secondary"}
            className="mb-2 w-fit"
          >
            {post.type === "diary" ? "Tagebuch" : "Wissenschaft"}
          </Badge>
          <CardTitle className="mb-2 text-lg font-semibold leading-snug">
            {post.title}
          </CardTitle>
          <CardDescription className="line-clamp-3 flex-1 text-sm">
            {post.excerpt}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarDays className="mr-1.5 h-4 w-4" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Lesen <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
