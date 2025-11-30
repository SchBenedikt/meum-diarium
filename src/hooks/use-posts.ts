import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BlogPost } from '@/types/blog';
import { getAllPosts } from '@/data/posts';

export function usePosts() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['posts'],
    queryFn: getAllPosts,
  });

  return { posts: posts || [], isLoading };
}
