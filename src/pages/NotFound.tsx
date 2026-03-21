import { Link } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapOff, Home, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

const NotFound = () => {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-background/80">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/3 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <main className="relative flex-1 flex items-center justify-center px-4 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl"
        >
          {/* Error Code */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="relative h-32 flex items-center justify-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-full blur-2xl"
              />
              <div className="relative text-center">
                <motion.p
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="font-display text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent"
                >
                  404
                </motion.p>
                <motion.div
                  animate={{ x: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -right-12 top-8"
                >
                  <MapOff className="h-10 w-10 text-primary/60" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div variants={itemVariants} className="text-center space-y-6 mb-12">
            <div className="space-y-3">
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                {t('notFoundTitle') || 'Seite nicht gefunden'}
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t('notFoundDesc') || 'Die angeforderte Seite existiert nicht oder wurde verschoben. Vielleicht ist sie auf einer Expedition nach Gallien?'}
              </p>
            </div>
          </motion.div>

          {/* Glass Card with Navigation Options */}
          <motion.div
            variants={itemVariants}
            className="mb-12 bg-card/60 backdrop-blur-xl rounded-3xl border border-border/40 p-8 shadow-lg shadow-primary/5"
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-6 text-center">
              Wohin soll es gehen?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Home Button */}
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05, translateY: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 p-6 text-left transition-all duration-300 hover:border-primary/60 hover:from-primary/30 hover:to-primary/10"
                >
                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                        <Home className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-bold text-primary">Startseite</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Zurück zur Übersicht
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </Link>

              {/* Search Button */}
              <Link to="/search">
                <motion.button
                  whileHover={{ scale: 1.05, translateY: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 p-6 text-left transition-all duration-300 hover:border-primary/60 hover:from-primary/30 hover:to-primary/10"
                >
                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                        <Search className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-bold text-primary">Suche</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Nach Einträgen suchen
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Back Button */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <motion.button
              onClick={() => window.history.back()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card hover:bg-card/80 border border-border/40 text-sm font-semibold transition-all duration-200 hover:border-primary/50"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('notFoundBtn') || 'Zurück'}
            </motion.button>
          </motion.div>

          {/* Decorative Quote */}
          <motion.div
            variants={itemVariants}
            className="mt-16 text-center"
          >
            <p className="text-muted-foreground/60 italic text-sm">
              "Non omnia possumus"
              <span className="block text-xs text-muted-foreground/40 mt-1">
                — Nicht alles können wir
              </span>
            </p>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
