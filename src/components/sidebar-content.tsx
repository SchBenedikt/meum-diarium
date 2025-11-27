import {
  Avatar,
  AvatarFallback,
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
    <SidebarContentArea>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <LaurelWreathIcon className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold text-sidebar-foreground">
            Meum Diarium
          </h1>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarMenu className="flex-1 p-4">
        <span className="mb-2 block px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
          Autoren
        </span>
        {authors.map((author) => (
          <SidebarMenuItem key={author.id}>
            <SidebarMenuButton
              onClick={() => onAuthorChange(author)}
              isActive={selectedAuthor.id === author.id}
              className="h-auto justify-start p-2"
            >
              <Avatar className="h-8 w-8">
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
