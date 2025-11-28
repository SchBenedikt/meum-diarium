
import { authors } from '@/data/authors';
import { useAuthor } from '@/context/AuthorContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function AuthorGrid() {
  const { setCurrentAuthor } = useAuthor();

  return (
    <section className="py-24 bg-background">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Voces Antiquitatis
            </span>
            <h2 className="font-display text-3xl sm:text-4xl mb-4">
              Auctorem Elige
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Quisque auctor singularem prospectum praebet in tempora turbulenta Romae antiquae.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Object.values(authors).map((author, index) => (
              <motion.div
                key={author.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={`/${author.id}`}
                  onClick={() => setCurrentAuthor(author.id)}
                  className="group flex flex-col text-left relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={author.heroImage}
                      alt={author.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  </div>
                  <div className="p-5 flex-1">
                    <h3 className="font-display text-xl font-medium mb-1">
                      {author.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {author.title}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
  );
}
