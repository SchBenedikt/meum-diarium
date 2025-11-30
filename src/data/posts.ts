import { BlogPost } from '@/types/blog';

// This function now dynamically imports all posts from the content directory.
// It uses Vite's `import.meta.glob` feature to find all post files.
export async function getAllPosts(): Promise<BlogPost[]> {
  const postImports = import.meta.glob('/src/content/posts/**/*.ts');

  const posts = await Promise.all(
    Object.values(postImports).map(async (importer) => {
      const { default: post } = await importer() as { default: BlogPost };
      return post;
    })
  );

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
