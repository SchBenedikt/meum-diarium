
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { BookOpen, Languages, Quote, History, Database, Users, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
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
            className: 'md:col-span-2'
        },
        {
            icon: Languages,
            titleKey: 'featureBilingualTitle',
            descKey: 'featureBilingualDesc',
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            className: ''
        },
        {
            icon: Sparkles,
            titleKey: 'featureTimelineTitle', // Reusing key for simplicity or adding logic
            descKey: 'featureTimelineDesc',
            color: 'text-rose-500',
            bg: 'bg-rose-500/10',
            className: ''
        },
        {
            icon: Database,
            titleKey: 'featureLexiconTitle',
            descKey: 'featureLexiconDesc',
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            className: 'md:col-span-2'
        },
        {
            icon: Users,
            titleKey: 'featureAuthorsTitle',
            descKey: 'featureAuthorsDesc',
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10',
            className: 'md:col-span-3 lg:col-span-1'
        },
        {
            icon: Quote,
            titleKey: 'featureQuoteTitle',
            descKey: 'featureQuoteDesc',
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            className: 'md:col-span-3 lg:col-span-2'
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
                        <span>{t('landing.features.innovationHub.badge')}</span>
                    </motion.div>
                    <motion.h2
                        variants={fadeUp(0.2)}
                        className="font-display text-4xl sm:text-5xl md:text-5xl font-bold mb-6 text-foreground tracking-tight"
                    >
                        {(t('landing.features.innovationHub.titleMain') as string)}<span className="text-primary italic">{(t('landing.features.innovationHub.titleHighlight') as string)}</span>{(t('landing.features.innovationHub.titleEnd') as string)}
                    </motion.h2>
                    <motion.p
                        variants={fadeUp(0.3)}
                        className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-light"
                    >
                        {t('featuresSectionSubtitle')}
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={staggerContainer(0.05)}
                    className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
                >
                    {features.map((feature, i) => (
                        <motion.div key={i} variants={fadeUp(0.3 + i * 0.05)} className={feature.className}>
                            <Card className={cn(
                                "h-full p-8 bg-card/40 backdrop-blur-2xl border border-border/40 hover:border-primary/20 hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden rounded-[2rem]",
                                "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity"
                            )}>
                                {/* Glow Effect */}
                                <div className={cn(
                                    "absolute -right-12 -top-12 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-700",
                                    feature.bg
                                )} />

                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500",
                                    feature.bg
                                )}>
                                    <feature.icon className={cn("w-6 h-6", feature.color)} />
                                </div>
                                <h3 className="font-display text-2xl font-extrabold mb-3 tracking-tight group-hover:text-primary transition-colors">
                                    {t(feature.titleKey)}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed font-light">
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
