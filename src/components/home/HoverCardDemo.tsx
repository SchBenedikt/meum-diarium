import { motion } from 'framer-motion';
import { BookOpen, Sparkles, MapPin, Quote, Users, Zap, Clock, Shield } from 'lucide-react';
import { useState } from 'react';

export function HoverCardDemo() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const demoCards = [
    {
      icon: BookOpen,
      title: 'Lesbar',
      description: 'Hochwertiger Text mit angepasster Typografie',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Sparkles,
      title: 'Interaktiv',
      description: 'Hover-Effekte zeigen zusätzliche Informationen',
      color: 'from-amber-500 to-amber-600',
    },
    {
      icon: MapPin,
      title: 'Ortsbezogen',
      description: 'Mit historischen Orten und Karten verlinkt',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: Quote,
      title: 'Zitate',
      description: 'Originale Texte aus historischen Quellen',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Users,
      title: 'Mehrere Autoren',
      description: 'Caesar, Cicero, Augustus und weitere Perspektiven',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Zap,
      title: 'AI-Integration',
      description: 'Fragen stellen und Diskussionen führen',
      color: 'from-yellow-500 to-yellow-600',
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            HOVER-CARDS
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Interaktive Kartenerkundung
          </h2>
          <p className="text-muted-foreground">
            Fahre über die Karten, um die Funktionen zu erkunden. Jede Karte hat einzigartige Effekte.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {demoCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative h-56 rounded-[1.5rem] border border-border/50 bg-gradient-to-br from-card to-card/80 p-6 cursor-default overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
              >
                {/* Gradient background that appears on hover */}
                <div
                  className={`absolute inset-0 opacity-0 bg-gradient-to-br ${card.color} transition-opacity duration-300 group-hover:opacity-10`}
                />

                {/* Icon container with scale effect */}
                <div
                  className={`relative p-4 bg-gradient-to-br ${card.color} rounded-[1.2rem] w-fit mb-4 transition-all duration-300 ${
                    hoveredIndex === i ? 'scale-110 shadow-lg' : 'scale-100'
                  }`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {card.description}
                  </p>
                </div>

                {/* Animated border on hover */}
                <div className="absolute inset-0 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 rounded-[1.5rem] border border-primary/50 animate-pulse" />
                </div>

                {/* Hover indicator dot */}
                {hoveredIndex === i && (
                  <motion.div
                    layoutId="hoverDot"
                    className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-primary"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="rounded-[1.5rem] border border-border/50 bg-muted/30 p-6 sm:p-8">
            <h3 className="font-display font-bold text-lg mb-3">Was macht die Hover-Cards besonders?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Gradient Icons:</strong> Farbige Icons, die sich auf Hover ändern</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Skalierung:</strong> Icons wachsen beim Hovern für visuelle Feedback</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Schatten & Border:</strong> Subtile Elevation für 3D-Effekt</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Animierte Border:</strong> Pulsierender Rand zeigt Interaktivität</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Konsistente Border-Radius:</strong> Überall 1.5rem für einheitliches Design</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
