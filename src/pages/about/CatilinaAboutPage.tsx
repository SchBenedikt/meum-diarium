import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, MapPin, Sword, Shield, Scroll } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/motion';

export function CatilinaAboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
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
                  <Sword className="mr-2 h-3 w-3" />
                  Verschwörer
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-xs font-medium">
                  <Shield className="mr-2 h-3 w-3" />
                  Adliger
                </Badge>
              </div>
              
              <h1 className="font-bricolage text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                Lucius Sergius <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Catilina</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                108–62 v. Chr. Der römische Adlige und Politiker, bekannt für seine gescheiterte Verschwörung gegen den römischen Senat.
              </p>
            </motion.div>
            
            <motion.div variants={fadeUp(0.2)} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/catilina">
                <Button size="lg" className="rounded-full px-8 h-14 text-base bg-purple-500 hover:bg-purple-500/90">
                  Tagebuch lesen
                </Button>
              </Link>
              <Link to="/catilina/chat">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base">
                  Mit Catilina sprechen
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
                    <div className="p-3 bg-purple-500/10 rounded-xl">
                      <Calendar className="w-6 h-6 text-purple-500" />
                    </div>
                    <h2 className="font-bricolage text-2xl font-bold">Frühes Leben</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Geboren um 108 v. Chr. in eine patrizische Familie, war Catilina ein begüterter Adliger mit 
                    erheblichem politischen Einfluss. Seine militärische Karriere unter Sulla prägte seinen Charakter.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Political Career */}
            <motion.div variants={fadeUp(0.1)}>
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-pink-500/10 rounded-xl">
                      <Sword className="w-6 h-6 text-pink-500" />
                    </div>
                    <h2 className="font-bricolage text-2xl font-bold">Politische Karriere</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Catilinas Versuche, das Konsulat zu erlangen, scheiterten mehrfach. Seine wachsende 
                    Enttäuschung über die politische Elite führte zu seinen radikalen Plänen.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* The Conspiracy */}
            <motion.div variants={fadeUp(0.2)}>
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-indigo-500/10 rounded-xl">
                      <Shield className="w-6 h-6 text-indigo-500" />
                    </div>
                    <h2 className="font-bricolage text-2xl font-bold">Die Catilinarische Verschwörung</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    63 v. Chr. plante Catilina einen Staatsstreich, um die Macht in Rom zu übernehmen. 
                    Ciceros berühmte Reden gegen Catilina vereitelten den Plan und führten zu Catilinas Niederlage und Tod.
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
