import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  SidebarContent as SidebarContentArea,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import type { Author } from "@/lib/data";
import { LaurelWreathIcon } from "./icons";

type SidebarContentProps = {
  authors: Author[];
  selectedAuthor: Author;
  onAuthorChange: (author: Author) => void;
};

export function SidebarContent({
  authors,
  selectedAuthor,
  onAuthorChange,
}: SidebarContentProps) {
  return (
    <SidebarContentArea className="p-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <LaurelWreathIcon className="h-8 w-8 text-sidebar-primary" />
          <h1 className="font-headline text-2xl font-bold text-sidebar-foreground">
            Meum Diarium
          </h1>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarMenu className="p-4">
        <span className="px-2 text-xs font-medium uppercase text-sidebar-foreground/70">
          Autoren
        </span>
        {authors.map((author) => (
          <SidebarMenuItem key={author.id}>
            <SidebarMenuButton
              onClick={() => onAuthorChange(author)}
              isActive={selectedAuthor.id === author.id}
              className="h-auto p-2"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback>{author.initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="font-medium">{author.name}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarContentArea>
  );
}
