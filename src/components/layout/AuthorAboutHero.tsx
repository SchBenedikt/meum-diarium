import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { AuthorInfo } from '@/types/blog';
import { PageContent, PageLanguage } from '@/types/page';

interface AuthorAboutHeroProps {
    authorInfo: AuthorInfo;
    authorPage: PageContent | null;
    language: string;
    birthPlace: string;
}

export function AuthorAboutHero({
    authorInfo,
    authorPage,
    language,
    birthPlace,
}: AuthorAboutHeroProps) {
    const langKey = language.split('-')[0] as PageLanguage;

    return (
        <section className="relative min-h-screen flex items-center pt-32 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
                <img
                    src={authorInfo.heroImage}
                    alt={authorInfo.name}
                    className="w-full h-full object-cover scale-105 blur-[2px]"
                />
            </div>

            <div className="container mx-auto relative z-20 px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl p-6 sm:p-10 rounded-[2rem] bg-white/90 dark:bg-black/60 backdrop-blur-md border border-white/20 shadow-2xl"
                >
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4">
                        {authorInfo.years}
                    </span>
                    <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold mb-3 tracking-tighter text-foreground line-clamp-2">
                        {authorPage?.translations?.[langKey]?.heroTitle || authorPage?.heroTitle || authorInfo.name}
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-display italic mb-4">
                        {authorPage?.translations?.[langKey]?.heroSubtitle || authorPage?.heroSubtitle || authorInfo.title}
                    </p>

                    <div className="flex flex-col gap-4">
                        <div className="h-px w-12 bg-primary/30 rounded-full" />
                        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl font-light leading-relaxed">
                            {authorPage?.translations?.[langKey]?.projectDescription || authorPage?.projectDescription || authorInfo.description}
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
