import { AppShell } from "@/components/app-shell";
import { authors, posts } from "@/lib/data";

export default function Home() {
  return (
    <main>
      <AppShell authors={authors} posts={posts} />
    </main>
  );
}
