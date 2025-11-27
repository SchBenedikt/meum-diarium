import Link from "next/link";
import Image from "next/image";
import { posts, authors } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";

export default function PostPage({ params }: { params: { id: string } }) {
  const post = posts.find((p) => p.id === params.id);

  if (!post) {
    notFound();
  }

  const author = authors.find((a) => a.id === post.authorId);
  const image = PlaceHolderImages.find((img) => img.id === post.imageId);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-card/80 px-6 py-3 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Übersicht
            </Link>
          </Button>
          {author && (
            <div className="flex items-center gap-3">
               <div className="text-right">
                <p className="font-semibold">{author.name}</p>
                <p className="text-sm text-muted-foreground">{author.bio}</p>
               </div>
              <Avatar>
                <AvatarFallback>{author.initials}</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1">
        <article className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
          <div className="space-y-4">
            <Badge
              variant={post.type === "diary" ? "default" : "secondary"}
              className="w-fit"
            >
              {post.type === 'diary' ? 'Tagebuch' : 'Wissenschaft'}
            </Badge>
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
              {post.title}
            </h1>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
          </div>

          {image && (
            <div className="my-8 aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={image.imageUrl}
                alt={image.description}
                width={1200}
                height={675}
                data-ai-hint={image.imageHint}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg mx-auto mt-8 max-w-none text-foreground">
             {/* In a real application, this would be the full post content */}
            <p>{post.excerpt}</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh.</p>
            <p>Nam quis nulla. Integer malesuada. In in enim a arcu imperdiet malesuada. Sed vel lectus. Donec odio urna, tempus molestie, porttitor ut, iaculis quis, sem. Phasellus rhoncus. Aenean id metus id velit ullamcorper pulvinar. Vestibulum fermentum tortor id mi. Pellentesque ipsum. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin magna. In hac habitasse platea dictumst. Curabitur at lacus ac velit ornare lobortis. Curabitur a felis in nunc fringilla tristique.</p>
          </div>
        </article>
      </main>
      <footer className="border-t bg-card py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Meum Diarium. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
}
