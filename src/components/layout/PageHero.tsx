import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ModernBackground } from "@/components/ui/ModernBackground";
import { cn } from "@/lib/utils";

export type PageHeroProps = {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  actions?: ReactNode;
  backgroundImage?: string;
  kicker?: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
  noBackground?: boolean;
  tall?: boolean;
  bgScale?: number;
};

export function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  actions,
  backgroundImage,
  kicker,
  children,
  align = "left",
  noBackground = false,
  tall = false,
  bgScale = 1.1,
}: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden pt-24 sm:pt-32 pb-14 sm:pb-20", tall && !noBackground ? "min-h-[60vh] sm:min-h-[70vh]" : "", noBackground ? "bg-transparent" : "bg-background")}>{/* Hero wrapper matches Landing page spacing */}
      {!noBackground && backgroundImage && (
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt="Background"
            className="w-full h-full object-cover opacity-35 blur-[3px]"
            style={{ transform: `scale(${bgScale})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/50 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/60" />
        </div>
      )}

      {!noBackground && <ModernBackground />}

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div
          className={cn(
            "max-w-5xl",
            align === "center" ? "mx-auto text-center" : "text-left"
          )}
        >
          {eyebrow && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold mb-6 backdrop-blur-md border border-primary/20 uppercase tracking-[0.2em]"
            >
              {eyebrow}
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className={cn(
              "font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tighter font-bold",
              align === "center" ? "mx-auto" : ""
            )}
          >
            {title}{" "}
            {highlight && (
              <span className="text-primary italic block sm:inline text-5xl sm:text-6xl md:text-7xl">
                {highlight}
              </span>
            )}
          </motion.h1>

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={cn(
                "text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed mt-6 font-light",
                align === "center" ? "mx-auto" : ""
              )}
            >
              {description}
            </motion.p>
          )}

          {(actions || kicker) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className={cn(
                "mt-8 flex flex-wrap items-center gap-4 sm:gap-6",
                align === "center" ? "justify-center" : ""
              )}
            >
              {actions}
              {kicker && (
                <div className="text-sm text-muted-foreground/80">
                  {kicker}
                </div>
              )}
            </motion.div>
          )}

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="mt-10"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
