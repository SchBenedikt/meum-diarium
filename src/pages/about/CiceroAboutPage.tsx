import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, MapPin, BookOpen, MessageSquare, Scroll } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/motion';

export function CiceroAboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5" />
        <div className="container mx-auto px-4 sm:px-6 pt-32 pb-24 relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.1)}
            className="text-center space-y-8"
          >
            <motion.div variants={fadeUp(0)}>
              <Link to="/about" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6">
                <ArrowLeft className="h-4 w-4" />
                Zurück zur Übersicht
              </Link>
              
              <div className="flex justify-center gap-3 mb-6">
                <Badge variant="secondary" className="px-4 py-2 text-xs font-medium">
                  <MessageSquare className="mr-2 h-3 w-3" />
                  Redner
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-xs font-medium">
                  <BookOpen className="mr-2 h-3 w-3" />
                  Philosoph
                </Badge>
              </div>
              
              <h1 className="font-bricolage text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                Marcus Tullius <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Cicero</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                106–43 v. Chr. Der größte römische Redner und Philosoph, bekannt für seine Reden gegen Catilina und seine philosophischen Werke.
              </p>
            </motion.div>
            
            <motion.div variants={fadeUp(0.2)} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cicero">
                <Button size="lg" className="rounded-full px-8 h-14 text-base bg-blue-500 hover:bg-blue-500/90">
                  Tagebuch lesen
                </Button>
              </Link>
              <Link to="/cicero/chat">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base">
                  Mit Cicero sprechen
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer(0.1)}
            className="space-y-12"
          >
            {/* Early Life */}
            <motion.div variants={fadeUp(0)}>
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                      <Calendar className="w-6 h-6 text-blue-500" />
                    </div>
                    <h2 className="font-bricolage text-2xl font-bold">Frühes Leben</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Geboren am 3. Januar 106 v. Chr. in Arpinum, stammte Cicero aus einer wohlhabenden Ritterfamilie. 
                    Seine Ausbildung in Rom und Griechenland machte ihn zu einem der gebildetsten Männer seiner Zeit.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Political Career */}
            <motion.div variants={fadeUp(0.1)}>
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-indigo-500/10 rounded-xl">
                      <MessageSquare className="w-6 h-6 text-indigo-500" />
                    </div>
                    <h2 className="font-bricolage text-2xl font-bold">Politische Karriere</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Ciceros berühmteste Reden gegen Catilina (63 v. Chr.) retteten die Republik vor einer Verschwörung. 
                    Seine Philippischen Reden gegen Mark Anton zeigten seinen Mut bis zum Ende.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Philosophical Works */}
            <motion.div variants={fadeUp(0.2)}>
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-purple-500/10 rounded-xl">
                      <BookOpen className="w-6 h-6 text-purple-500" />
                    </div>
                    <h2 className="font-bricolage text-2xl font-bold">Philosophische Werke</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Werke wie "De re publica", "De legibus" und "De officiis" machten griechische Philosophie 
                    für Römer zugänglich. Seine Briefe bieten einzigartige Einblicke in das späte Republikanische Rom.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
