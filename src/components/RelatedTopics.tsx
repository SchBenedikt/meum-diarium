import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RelatedTopic {
  title: string;
  slug: string;
  author: string;
  excerpt: string;
  category?: string;
}

interface RelatedTopicsProps {
  topics: RelatedTopic[];
  title?: string;
  description?: string;
}

export function RelatedTopics({ topics, title = 'Weiterführende Themen', description }: RelatedTopicsProps) {
  if (!topics || topics.length === 0) return null;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {topics.map((topic, index) => (
            <Link
              key={index}
              to={`/${topic.author}/${topic.slug}`}
              className="group flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-accent/50 transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                    {topic.title}
                  </h4>
                  {topic.category && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {topic.category}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{topic.excerpt}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
