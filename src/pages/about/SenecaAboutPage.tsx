import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, MapPin, BookOpen, Brain, Scroll } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/motion';

export function SenecaAboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-teal-500/5" />
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
                  <Brain className="mr-2 h-3 w-3" />
                  Stoischer Philosoph
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-xs font-medium">
                  <BookOpen className="mr-2 h-3 w-3" />
                  Berater Neros
                </Badge>
              </div>
              
              <h1 className="font-bricolage text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                Lucius Annaeus <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">Seneca</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                4 v. Chr.–65 n. Chr. Der bedeutende stoische Philosoph, Lehrer Neros und Verfasser zahlreicher philosophischer Schriften und Dramen.
              </p>
            </motion.div>
            
            <motion.div variants={fadeUp(0.2)} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/seneca">
                <Button size="lg" className="rounded-full px-8 h-14 text-base bg-green-500 hover:bg-green-500/90">
                  Tagebuch lesen
                </Button>
              </Link>
              <Link to="/seneca/chat">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base">
                  Mit Seneca sprechen
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
                    <div className="p-3 bg-green-500/10 rounded-xl">
                      <Calendar className="w-6 h-6 text-green-500" />
                    </div>
                    <h2 className="font-bricolage text-2xl font-bold">Frühes Leben</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Geboren um 4 v. Chr. in Corduba, Hispanien, stammte Seneca aus einer wohlhabenden ritterlichen Familie. 
                    Seine Ausbildung in Rom umfasste Rhetorik und Philosophie, insbesondere die Stoa.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Political Career */}
            <motion.div variants={fadeUp(0.1)}>
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-teal-500/10 rounded-xl">
                      <BookOpen className="w-6 h-6 text-teal-500" />
                    </div>
                    <h2 className="font-bricolage text-2xl font-bold">Politische Karriere</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Als Lehrer und Berater des Kaisers Nero hatte Seneca erheblichen Einfluss auf die römische Politik. 
                    Seine Versuche, Nero zu einem weisen Herrscher zu erziehen, scheiterten schließlich.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Philosophical Works */}
            <motion.div variants={fadeUp(0.2)}>
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-emerald-500/10 rounded-xl">
                      <Brain className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h2 className="font-bricolage text-2xl font-bold">Philosophische Werke</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Werke wie "De brevitate vitae", "De tranquillitate animi" und die "Moralbriefe an Lucilius" 
                    machten ihn zum wichtigsten Vertreter der römischen Stoa. Seine Dramen beeinflussten die europäische Literatur.
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
