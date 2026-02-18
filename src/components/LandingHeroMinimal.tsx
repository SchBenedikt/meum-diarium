import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowRight, BookOpen, MessageCircle, Users } from 'lucide-react';
import { AuthorGrid } from './AuthorGrid';
import { usePosts } from '@/hooks/use-posts';
import { BlogCard } from './BlogCard';

export default function LandingHeroMinimal() {
  const { posts, isLoading } = usePosts();
  const recentPosts = posts
    ? [...posts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Minimalist */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <Badge variant="outline" className="mb-4">
              Historia Romana
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-light text-foreground leading-tight">
              <span className="font-medium">Historia</span>
              <br />
              <span className="text-muted-foreground">zum Leben erweckt</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Entdecke die Gedankenwelt der größten Persönlichkeiten des antiken Roms durch KI-gestützte Dialoge und historische Texte.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/caesar">
                <Button className="rounded-full">
                  Reise beginnen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/lexicon">
                <Button variant="outline" className="rounded-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Lexikon
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features - Simple Grid */}
      <section className="py-16 border-y">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: "KI-Gespräche",
                description: "Dialoge mit historischen Persönlichkeiten"
              },
              {
                icon: BookOpen,
                title: "Originaltexte",
                description: "Werke und Analysen aus der Antike"
              },
              {
                icon: Users,
                title: "5+ Autoren",
                description: "Die wichtigsten Stimmen Roms"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center space-y-4"
              >
                <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-lg font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Authors Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-light mb-4">Die Stimmen der Antike</h2>
            <p className="text-muted-foreground">Entdecke die Tagebücher römischer Persönlichkeiten</p>
          </motion.div>
          <AuthorGrid />
        </div>
      </section>

      {/* Recent Posts */}
      {!isLoading && recentPosts.length > 0 && (
        <section className="py-16 border-y">
          <div className="container mx-auto max-w-6xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-light mb-4">Neuste Einträge</h2>
              <p className="text-muted-foreground mb-8">Die neuesten Beiträge aus den Tagebüchern</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <BlogCard post={post} className="h-full" />
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/search">
                <Button variant="ghost">
                  Alle Beiträge
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-light">Bereit für deine Zeitreise?</h2>
            <p className="text-muted-foreground">
              Beginne jetzt deine Reise durch die faszinierende Welt des antiken Roms
            </p>
            <Link to="/caesar">
              <Button size="lg" className="rounded-full">
                Jetzt starten
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
