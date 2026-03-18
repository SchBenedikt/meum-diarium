import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, MapPin, Crown, Building, Heart } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/motion';

export function AugustusAboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-yellow-500/5" />
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
                  <Crown className="mr-2 h-3 w-3" />
                  Erster Kaiser
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-xs font-medium">
                  <Heart className="mr-2 h-3 w-3" />
                  Pax Romana
                </Badge>
              </div>
              
              <h1 className="font-bricolage text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                Gaius Octavius <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">Augustus</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                63 v. Chr.–14 n. Chr. Der erste römische Kaiser, der nach Caesars Tod das Reich befriedete und die Pax Romana einleitete.
              </p>
            </motion.div>
            
            <motion.div variants={fadeUp(0.2)} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/augustus">
                <Button size="lg" className="rounded-full px-8 h-14 text-base bg-amber-500 hover:bg-amber-500/90">
                  Tagebuch lesen
                </Button>
              </Link>
              <Link to="/augustus/chat">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base">
                  Mit Augustus sprechen
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
                    <div className="p-3 bg-amber-500/10 rounded-xl">
                      <Calendar className="w-6 h-6 text-amber-500" />
                    </div>
                    <h2 className="font-bricolage text-2xl font-bold">Frühes Leben</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Geboren am 23. September 63 v. Chr. als Octavius, war er der Großneffe und Adoptivsohn Julius Caesars. 
                    Nach Caesars Ermordung 44 v. Chr. erbte er dessen Namen und Vermögen.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Rise to Power */}
            <motion.div variants={fadeUp(0.1)}>
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-yellow-500/10 rounded-xl">
                      <Crown className="w-6 h-6 text-yellow-500" />
                    </div>
                    <h2 className="font-bricolage text-2xl font-bold">Aufstieg zur Macht</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Nach den Bürgerkriegen gegen Marcus Antonius und Kleopatra wurde Octavian 31 v. Chr. 
                    unangefochtener Herrscher. 27 v. Chr. nahm er den Titel Augustus an und begründete das Kaiserreich.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Reign and Legacy */}
            <motion.div variants={fadeUp(0.2)}>
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-orange-500/10 rounded-xl">
                      <Building className="w-6 h-6 text-orange-500" />
                    </div>
                    <h2 className="font-bricolage text-2xl font-bold">Herrschaft und Vermächtnis</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Augustus' 41-jährige Herrschaft brachte die Pax Romana, eine Epoche des Friedens und Wohlstands. 
                    Er baute Rom neu, reformierte die Verwaltung und sicherte die Grenzen des Reiches.
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
