import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Info, X } from 'lucide-react';

interface HeroImage {
  id: string;
  src: string;
  alt: string;
  name: string;
  description: string;
  details: string[];
}

const heroImages: HeroImage[] = [
  { 
    id: 'image', 
    src: '/image.png', 
    alt: 'Antikes Rom', 
    name: 'Antikes Rom',
    description: 'Die majestätische Welt des antiken Roms',
    details: ['Hauptstadt des Römischen Reiches', 'Zentrum von Kultur und Politik', 'Grundlage westlicher Zivilisation']
  },
  { 
    id: 'landing-hero', 
    src: '/landing-hero.png', 
    alt: 'Meum Diarium Hero', 
    name: 'Meum Diarium',
    description: 'Dein persönliches Tagebuch der Antike',
    details: ['KI-gestützte Gespräche', 'Interaktiver Zeitstrahl', 'Umfangreiches Lexikon', 'Lateinische Grammatik']
  },
  { 
    id: 'augustus', 
    src: '/images/augustus-hero.png', 
    alt: 'Augustus', 
    name: 'Augustus',
    description: 'Erster Kaiser des Römischen Reiches',
    details: ['63 v.Chr.–14 n.Chr.', 'Großneffe von Julius Caesar', 'Pax Romana - 200 Jahre Frieden']
  },
  { 
    id: 'caesar', 
    src: '/images/caesar-hero.png', 
    alt: 'Caesar', 
    name: 'Caesar',
    description: 'Feldherr, Diktator und Schriftsteller',
    details: ['100–44 v.Chr.', 'Eroberer Galliens', 'Berühmte Reden und Schriften']
  },
  { 
    id: 'catilina', 
    src: '/images/catilina-hero.png', 
    alt: 'Catilina', 
    name: 'Catilina',
    description: 'Verschwörer gegen die Republik',
    details: ['108–62 v.Chr.', 'Catilinarische Verschwörung', 'Gegner von Cicero']
  },
  { 
    id: 'cicero', 
    src: '/images/cicero-hero.png', 
    alt: 'Cicero', 
    name: 'Cicero',
    description: 'Größter Redner der Antike',
    details: ['106–43 v.Chr.', 'Philosoph und Staatsmann', 'Vater der Rhetorik']
  },
  { 
    id: 'seneca', 
    src: '/images/seneca-hero.png', 
    alt: 'Seneca', 
    name: 'Seneca',
    description: 'Stoischer Philosoph und Dramatiker',
    details: ['4 v.Chr.–65 n.Chr.', 'Lehrer von Nero', 'Einfluss auf christliche Ethik']
  },
];

export function HeroImageGallery() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  const handleImageClick = (index: number) => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowInfo(true);
  };

  const handleCloseInfo = () => {
    setShowInfo(false);
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-3xl">
      {/* Background decoration - matching app background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.05),transparent_50%)]" />
      
      {/* Image stack */}
      <div className="relative w-full h-full flex items-center justify-center">
        {heroImages.map((image, index) => {
          const isSelected = index === selectedIndex;
          const offset = index - selectedIndex;
          const zIndex = heroImages.length - Math.abs(offset);
          
          return (
            <motion.div
              key={image.id}
              className="absolute w-80 h-96 cursor-pointer"
              initial={false}
              animate={{
                x: offset * 60,
                y: Math.abs(offset) * 20,
                rotate: isSelected ? 0 : offset * 8,
                scale: isSelected ? 1.1 : 1 - Math.abs(offset) * 0.1,
                zIndex,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              whileHover={{
                scale: isSelected ? 1.15 : 1.05,
                rotate: isSelected ? 2 : offset * 8 + 2,
              }}
              onClick={() => handleImageClick(index)}
              style={{
                filter: isSelected ? 'none' : `brightness(${0.7 - Math.abs(offset) * 0.1})`,
              }}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Image label */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-6 text-white"
                  initial={false}
                  animate={{
                    opacity: isSelected ? 1 : 0.7,
                  }}
                >
                  <h3 className="text-2xl font-bold mb-2">{image.name}</h3>
                  {isSelected && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={handleInfoClick}
                      className="mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-xs font-medium flex items-center gap-1 transition-all duration-300"
                    >
                      <Info className="h-3 w-3" />
                      Mehr Informationen
                    </motion.button>
                  )}
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === selectedIndex
                ? "w-8 bg-primary"
                : "bg-white/50 hover:bg-white/70"
            )}
          />
        ))}
      </div>

      {/* Information Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-30"
            onClick={handleCloseInfo}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-card border border-border rounded-2xl p-6 max-w-md mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground">{heroImages[selectedIndex].name}</h3>
                <button
                  onClick={handleCloseInfo}
                  className="p-1 hover:bg-secondary rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              
              <p className="text-muted-foreground mb-4">{heroImages[selectedIndex].description}</p>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground text-sm">Besondere Merkmale:</h4>
                <ul className="space-y-1">
                  {heroImages[selectedIndex].details.map((detail, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {heroImages[selectedIndex].id !== 'image' && heroImages[selectedIndex].id !== 'landing-hero' && (
                <div className="mt-6 pt-4 border-t border-border">
                  <a
                    href={`/${heroImages[selectedIndex].id}`}
                    className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Zur Seite von {heroImages[selectedIndex].name}
                    <Info className="h-3 w-3" />
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
