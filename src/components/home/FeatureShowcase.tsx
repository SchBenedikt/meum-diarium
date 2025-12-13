import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import {
    Clock,
    BookMarked,
    Users,
    FileText,
    Languages,
    Quote
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { fadeUp, staggerContainer, defaultTransition } from '@/lib/motion';

interface Feature {
    icon: React.ElementType;
    titleKey: string;
    titleFallback: string;
    descKey: string;
    descFallback: string;
}

const features: Feature[] = [
    {
        icon: Clock,
        titleKey: 'featureTimelineTitle',
        titleFallback: 'Interaktive Zeitleiste',
        descKey: 'featureTimelineDesc',
        descFallback: 'Erkunde die antike Geschichte chronologisch - von der Gründung Roms bis zum Fall des Imperiums.'
    },
    {
        icon: BookMarked,
        titleKey: 'featureLexiconTitle',
        titleFallback: 'Latein-Lexikon',
        descKey: 'featureLexiconDesc',
        descFallback: 'Umfassendes Vokabular mit Definitionen, Beispielen und grammatischen Erklärungen.'
    },
    {
        icon: Users,
        titleKey: 'featureAuthorsTitle',
        titleFallback: 'Römische Autoren',
        descKey: 'featureAuthorsDesc',
        descFallback: 'Lese Werke von Caesar, Cicero, Augustus und Seneca aus verschiedenen Perspektiven.'
    },
    {
        icon: FileText,
        titleKey: 'featureStudyNotesTitle',
        titleFallback: 'Lernzettel',
        descKey: 'featureStudyNotesDesc',
        descFallback: 'Strukturierte Zusammenfassungen und Lernhilfen für jedes Werk.'
    },
    {
        icon: Languages,
        titleKey: 'featureBilingualTitle',
        titleFallback: 'Zweisprachiges Lesen',
        descKey: 'featureBilingualDesc',
        descFallback: 'Lateinische Originaltexte mit deutschen Übersetzungen nebeneinander.'
    },
    {
        icon: Quote,
        titleKey: 'featureQuoteTitle',
        titleFallback: 'Zitat des Tages',
        descKey: 'featureQuoteDesc',
        descFallback: 'Tägliche Inspiration aus der antiken Weisheit römischer Denker.'
    }
];

export function FeatureShowcase() {
    const { t } = useLanguage();

    return (
        <section className="py-24 bg-surface-container-low">
            <div className="container mx-auto px-6">
                <motion.div
                    variants={fadeUp()}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={defaultTransition}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl mb-5 tracking-tight text-foreground">
                        {t('featuresSectionTitle') || 'Was dich erwartet'}
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
                        {t('featuresSectionSubtitle') || 'Alles was du brauchst, um die antike Welt zu entdecken'}
                    </p>
                </motion.div>

                <motion.div
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
                    variants={staggerContainer(0.08)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.titleKey}
                            variants={fadeUp(index * 0.08, 24)}
                        >
                            <Card className="h-full border-border/50 hover:border-primary/30 transition-colors group">
                                <CardHeader>
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/15 transition-colors">
                                        <feature.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="font-display text-xl font-medium text-foreground">
                                        {t(feature.titleKey) || feature.titleFallback}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {t(feature.descKey) || feature.descFallback}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
