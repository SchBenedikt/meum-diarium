
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { BookOpen, Languages, Quote, History, Database, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { ModernBackground } from '../ui/ModernBackground';

export function FeatureShowcase() {
    const { t } = useLanguage();

    const features = [
        {
            icon: BookOpen,
            titleKey: 'featureStudyNotesTitle',
            descKey: 'featureStudyNotesDesc',
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            icon: Languages,
            titleKey: 'featureBilingualTitle',
            descKey: 'featureBilingualDesc',
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
        {
            icon: Quote,
            titleKey: 'featureQuoteTitle',
            descKey: 'featureQuoteDesc',
            color: 'text-amber-500',
            bg: 'bg-amber-500/10'
        },
        {
            icon: History,
            titleKey: 'featureTimelineTitle',
            descKey: 'featureTimelineDesc',
            color: 'text-rose-500',
            bg: 'bg-rose-500/10'
        },
        {
            icon: Database,
            titleKey: 'featureLexiconTitle',
            descKey: 'featureLexiconDesc',
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
        {
            icon: Users,
            titleKey: 'featureAuthorsTitle',
            descKey: 'featureAuthorsDesc',
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10'
        }
    ];

    return (
        <section className="py-20 sm:py-32 bg-background relative overflow-hidden">
            {/* Background decorations - keep these as additional accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-3xl animate-blob" />
                <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer(0.1)}
                    className="max-w-4xl mx-auto text-center mb-16"
                >
                    <motion.h2
                        variants={fadeUp(0.1)}
                        className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 text-foreground"
                    >
                        {t('featuresSectionTitle') || 'Funktionen entdecken'}
                    </motion.h2>
                    <motion.p
                        variants={fadeUp(0.2)}
                        className="text-lg sm:text-xl text-muted-foreground leading-relaxed"
                    >
                        {t('featuresSectionSubtitle') || 'Mehr als nur ein Blog – ein umfassendes Lerntool.'}
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={staggerContainer(0.05)}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto"
                >
                    {features.map((feature, i) => (
                        <motion.div key={i} variants={fadeUp(0.3 + i * 0.05)}>
                            <Card className="h-full p-6 sm:p-8 bg-surface-container-low/30 backdrop-blur-md border border-white/5 hover:border-primary/40 hover:-translate-y-2 hover:bg-surface-container-low/50 transition-all duration-300 group relative overflow-hidden">
                                {/* Subtle background glow on hover */}
                                <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${feature.bg}`} />

                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${feature.bg}`}>
                                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                                </div>
                                <h3 className="font-display text-xl font-medium mb-3 group-hover:text-primary transition-colors">
                                    {t(feature.titleKey)}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
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
