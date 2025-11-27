"use client";

import type { Author, Post } from "@/lib/data";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { SidebarContent } from "@/components/sidebar-content";
import { MainContent } from "@/components/main-content";
import { useEffect, useState, useTransition } from "react";
import { getThemeForAuthor } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { hexToHsl } from "@/lib/utils";
import type { AdjustThemeOutput } from "@/ai/flows/dynamic-theme-adjustment";

type AppShellProps = {
  authors: Author[];
  posts: Post[];
};

export function AppShell({ authors, posts }: AppShellProps) {
  const [selectedAuthor, setSelectedAuthor] = useState<Author>(authors[0]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAuthorChange = (author: Author) => {
    startTransition(() => {
      setSelectedAuthor(author);
    });
  };

  useEffect(() => {
    const applyDynamicTheme = async () => {
      if (!selectedAuthor || selectedAuthor.id === "caesar") {
        // Reset to default theme if Caesar is selected (which is our base theme)
        document.documentElement.removeAttribute("style");
        return;
      }

      try {
        const theme = await getThemeForAuthor(selectedAuthor.name);
        if (theme) {
          applyTheme(theme);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Theme Error",
          description:
            error instanceof Error
              ? error.message
              : "Could not load dynamic theme.",
        });
      }
    };

    applyDynamicTheme();
  }, [selectedAuthor, toast]);

  const applyTheme = (theme: AdjustThemeOutput) => {
    const root = document.documentElement;

    const colorMap: { [key in keyof AdjustThemeOutput]?: string } = {
      primaryColor: "--primary",
      backgroundColor: "--background",
      accentColor: "--accent",
    };

    for (const [key, value] of Object.entries(theme)) {
      const cssVar = colorMap[key as keyof AdjustThemeOutput];
      if (cssVar && typeof value === 'string' && value.startsWith('#')) {
        root.style.setProperty(cssVar, hexToHsl(value));
      }
    }
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
