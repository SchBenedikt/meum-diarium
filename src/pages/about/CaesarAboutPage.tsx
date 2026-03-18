import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, MapPin, Crown, Sword, Scroll } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/motion';

export function CaesarAboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5" />
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
                  Diktator
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-xs font-medium">
                  <Sword className="mr-2 h-3 w-3" />
                  Feldherr
                </Badge>
              </div>
              
              <h1 className="font-bricolage text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                Gaius Iulius <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Caesar</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                100–44 v. Chr. Der berühmte römische Feldherr und Staatsmann, der den Rubikon überschritt und das Ende der Römischen Republik einleitete.
              </p>
            </motion.div>
            
            <motion.div variants={fadeUp(0.2)} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/caesar">
                <Button size="lg" className="rounded-full px-8 h-14 text-base bg-red-500 hover:bg-red-500/90">
                  Tagebuch lesen
                </Button>
              </Link>
              <Link to="/caesar/chat">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base">
                  Mit Caesar sprechen
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
                    <div className="p-3 bg-red-500/10 rounded-xl">
                      <Calendar className="w-6 h-6 text-red-500" />
                    </div>
                    <h2 className="font-bricolage text-2xl font-bold">Frühes Leben</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Geboren am 13. Juli 100 v. Chr. in einer patrizischen Familie, entstammte Caesar dem alten Julischen Geschlecht. 
                    Seine frühe Ausbildung umfasste Rhetorik, Literatur und Militärstrategie, was ihn für seine spätere politische Karriere prägte.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Military Career */}
            <motion.div variants={fadeUp(0.1)}>
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-orange-500/10 rounded-xl">
                      <Sword className="w-6 h-6 text-orange-500" />
                    </div>
                    <h2 className="font-bricolage text-2xl font-bold">Militärische Karriere</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Caesars militärische Genie zeigte sich in der Eroberung Galliens (58–50 v. Chr.). Seine berühmten Worte 
                    "Veni, vidi, vici" ("Ich kam, sah, siegte") beschreiben seine schnellen Siege. Der Übergang des Rubikon 49 v. Chr. 
                    leitete den Bürgerkrieg ein.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Political Legacy */}
            <motion.div variants={fadeUp(0.2)}>
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-amber-500/10 rounded-xl">
                      <Crown className="w-6 h-6 text-amber-500" />
                    </div>
                    <h2 className="font-bricolage text-2xl font-bold">Politisches Vermächtnis</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Als Diktator reformierte Caesar den römischen Kalender, förderte öffentliche Bauten und erweiterte das Senatsmitglied. 
                    Seine Ermordung an den Iden des März 44 v. Chr. beendete seine Herrschaft, aber sein Einfluss auf Rom war unbestreitbar.
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
