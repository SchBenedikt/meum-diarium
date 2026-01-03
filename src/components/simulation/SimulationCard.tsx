import { motion } from 'framer-motion';
import { Play, Users, Crown, Sword } from 'lucide-react';
import { SimulationScenario } from '@/data/simulations';

interface SimulationCardProps {
    scenario: SimulationScenario;
    onClick: (scenario: SimulationScenario) => void;
}

export function SimulationCard({ scenario, onClick }: SimulationCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card min-h-[240px] cursor-pointer flex flex-col group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border border-border/40 hover:border-primary/40 h-full"
            onClick={() => onClick(scenario)}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                    {scenario.date}
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Play className="h-4 w-4" />
                </div>
            </div>

            <h3 className="font-display text-2xl font-medium mb-3 group-hover:text-primary transition-colors">
                {scenario.title}
            </h3>

            <p className="text-muted-foreground mb-6 line-clamp-3 flex-1 leading-relaxed text-sm">
                {scenario.description}
            </p>

        </motion.div>
    );
}
