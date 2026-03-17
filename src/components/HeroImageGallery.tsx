import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroImage {
  id: string;
  src: string;
  alt: string;
  name: string;
}

const heroImages: HeroImage[] = [
  { id: 'image', src: '/image.png', alt: 'Antikes Rom', name: 'Antikes Rom' },
  { id: 'landing-hero', src: '/landing-hero.png', alt: 'Meum Diarium Hero', name: 'Meum Diarium' },
  { id: 'augustus', src: '/images/augustus-hero.jpg', alt: 'Augustus', name: 'Augustus' },
  { id: 'caesar', src: '/images/caesar-hero.jpg', alt: 'Caesar', name: 'Caesar' },
  { id: 'catilina', src: '/images/catilina-hero.jpg', alt: 'Catilina', name: 'Catilina' },
  { id: 'cicero', src: '/images/cicero-hero.jpg', alt: 'Cicero', name: 'Cicero' },
  { id: 'seneca', src: '/images/seneca-hero.jpg', alt: 'Seneca', name: 'Seneca' },
];

export function HeroImageGallery() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
  };

  const handlePreviousClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prevIndex) => (prevIndex - 1 + heroImages.length) % heroImages.length);
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
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
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePreviousClick}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 z-20"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={handleNextClick}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 z-20"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

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
    </div>
  );
}
