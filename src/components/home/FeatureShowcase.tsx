
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { BookOpen, Languages, Quote, History, Database, Users, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { fadeUp, staggerContainer } from '@/lib/motion';

export function FeatureShowcase() {
    const { t } = useLanguage();

    const features = [
        {
            icon: BookOpen,
            titleKey: 'featureStudyNotesTitle',
            descKey: 'featureStudyNotesDesc',
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'hover:border-blue-500/50'
        },
        {
            icon: Languages,
            titleKey: 'featureBilingualTitle',
            descKey: 'featureBilingualDesc',
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            border: 'hover:border-purple-500/50'
        },
        {
            icon: Quote,
            titleKey: 'featureQuoteTitle',
            descKey: 'featureQuoteDesc',
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            border: 'hover:border-amber-500/50'
        },
        {
            icon: History,
            titleKey: 'featureTimelineTitle',
            descKey: 'featureTimelineDesc',
            color: 'text-rose-500',
            bg: 'bg-rose-500/10',
            border: 'hover:border-rose-500/50'
        },
        {
            icon: Database,
            titleKey: 'featureLexiconTitle',
            descKey: 'featureLexiconDesc',
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            border: 'hover:border-emerald-500/50'
        },
        {
            icon: Users,
            titleKey: 'featureAuthorsTitle',
            descKey: 'featureAuthorsDesc',
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10',
            border: 'hover:border-indigo-500/50'
        }
    ];

    return (
        <section className="py-32 bg-background relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer(0.1)}
                    className="max-w-4xl mx-auto text-center mb-24"
                >
                    <motion.div
                        variants={fadeUp(0.1)}
                        className="flex items-center justify-center gap-2 text-primary font-bold tracking-widest uppercase text-sm mb-4"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Innovations-Hub</span>
                    </motion.div>
                    <motion.h2
                        variants={fadeUp(0.2)}
                        className="font-display text-4xl sm:text-5xl md:text-5xl font-bold mb-6 text-foreground tracking-tight"
                    >
                        Die <span className="text-primary italic">Zukunft</span> der Geschichtsschreibung
                    </motion.h2>
                    <motion.p
                        variants={fadeUp(0.3)}
                        className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-light"
                    >
                        {t('featuresSectionSubtitle') || 'Entdecke ein Ökosystem, das historisches Wissen durch modernste Technologie zum Leben erweckt.'}
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={staggerContainer(0.05)}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
                >
                    {features.map((feature, i) => (
                        <motion.div key={i} variants={fadeUp(0.3 + i * 0.05)}>
                            <Card className={`h-full p-8 sm:p-8 bg-card/40 backdrop-blur-2xl border border-border/40 ${feature.border} hover:-translate-y-1.5 transition-all duration-500 group relative overflow-hidden rounded-3xl`}>
                                {/* Gradient background glow */}
                                <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${feature.bg}`} />

                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/10 ${feature.bg}`}>
                                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                                </div>
                                <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                    {t(feature.titleKey)}
                                </h3>
                                <p className="text-base text-muted-foreground leading-relaxed font-light">
                                    {t(feature.descKey)}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
