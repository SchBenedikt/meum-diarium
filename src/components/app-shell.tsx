"use client";

import type { Author, Post } from "@/lib/data";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { SidebarContent } from "@/components/sidebar-content";
import { MainContent } from "@/components/main-content";
import { useState, useTransition } from "react";

type AppShellProps = {
  authors: Author[];
  posts: Post[];
};

export function AppShell({ authors, posts }: AppShellProps) {
  const [selectedAuthor, setSelectedAuthor] = useState<Author>(authors[0]);
  const [isPending, startTransition] = useTransition();

  const handleAuthorChange = (author: Author) => {
    startTransition(() => {
      setSelectedAuthor(author);
    });
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent
          authors={authors}
          selectedAuthor={selectedAuthor}
          onAuthorChange={handleAuthorChange}
        />
      </Sidebar>
      <SidebarInset>
        <MainContent
          key={selectedAuthor.id}
          author={selectedAuthor}
          posts={posts}
          isLoading={isPending}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
