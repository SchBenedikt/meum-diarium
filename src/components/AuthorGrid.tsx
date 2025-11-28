import { authors } from '@/data/authors';
import { useAuthor } from '@/context/AuthorContext';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const authorColorClasses: Record<string, string> = {
  caesar: 'bg-author-caesar',
  cicero: 'bg-author-cicero',
  augustus: 'bg-author-augustus',
  seneca: 'bg-author-seneca',
};

const authorTextColors: Record<string, string> = {
  caesar: 'text-author-caesar',
  cicero: 'text-author-cicero',
  augustus: 'text-author-augustus',
  seneca: 'text-author-seneca',
};

export function AuthorGrid() {
  const { setCurrentAuthor, currentAuthor } = useAuthor();

  return (
    <section className="py-20 border-t border-border">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            Autoren
          </span>
          <h2 className="font-display text-3xl md:text-4xl mb-3">
            Weitere Stimmen der Antike
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Entdecke die Tagebücher anderer Persönlichkeiten
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Object.values(authors).map((author, index) => {
            const isActive = author.id === currentAuthor;
            
            return (
              <motion.div
                key={author.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  to={`/${author.id}`}
                  onClick={() => setCurrentAuthor(author.id)}
                  className={`group text-left card-elevated !p-0 overflow-hidden block h-full ${
                    isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={author.heroImage}
                      alt={author.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                    <div className={`absolute top-0 left-0 right-0 h-1 ${authorColorClasses[author.id]}`} />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-display text-base font-medium mb-1 group-hover:text-primary transition-colors">
                      {author.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {author.years}
                    </p>
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${authorTextColors[author.id]}`}>
                      <span>Tagebücher lesen</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
