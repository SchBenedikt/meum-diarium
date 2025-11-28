
import { useAuthor } from "@/context/AuthorContext";
import { cn } from "@/lib/utils";
import { BookCopy, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function AuthorHeader() {
  const { authorInfo } = useAuthor();
  const location = useLocation();

  if (!authorInfo) return null;

  const navItems = [
    { href: `/${authorInfo.id}`, label: "Tagebuch", icon: BookCopy },
    { href: `/${authorInfo.id}/about`, label: "Über den Autor", icon: User },
  ];

  return (
    <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto">
        <div className="flex h-14 items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={authorInfo.heroImage} alt={authorInfo.name} className="h-8 w-8 rounded-lg object-cover"/>
            <span className="font-display text-lg">{authorInfo.name.split(' ').pop()}</span>
          </div>

          <nav className="flex items-center gap-1">
             {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all",
                    location.pathname === item.href
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
