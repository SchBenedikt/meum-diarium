"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Author, Post } from "@/lib/data";
import { PostCard } from "./post-card";
import { cn } from "@/lib/utils";

type MainContentProps = {
  author: Author;
  posts: Post[];
  isLoading: boolean;
};

export function MainContent({ author, posts, isLoading }: MainContentProps) {
  const authorPosts = posts.filter((post) => post.authorId === author.id);
  const diaryPosts = authorPosts.filter((post) => post.type === "diary");
  const scientificPosts = authorPosts.filter(
    (post) => post.type === "scientific"
  );

  return (
    <div
      className={cn(
        "flex flex-1 flex-col transition-opacity duration-500 ease-in-out",
        isLoading ? "opacity-0" : "opacity-100"
      )}
    >
      <header className="flex h-16 items-center justify-between border-b bg-card/80 px-4 backdrop-blur-sm md:h-20 md:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{author.initials}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-headline text-lg font-bold">
                {author.name}
              </h2>
              <p className="text-sm text-muted-foreground">{author.bio}</p>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <Tabs defaultValue="diary" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="diary">Tagebuch</TabsTrigger>
            <TabsTrigger value="scientific">Wissenschaftlich</TabsTrigger>
          </TabsList>
          <TabsContent value="diary">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {diaryPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
             {diaryPosts.length === 0 && (
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
                <p className="text-muted-foreground">Keine Tagebucheinträge von {author.name}.</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="scientific">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {scientificPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            {scientificPosts.length === 0 && (
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
                <p className="text-muted-foreground">Keine wissenschaftlichen Artikel von {author.name}.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
