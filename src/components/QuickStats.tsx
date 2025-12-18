import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';

interface Stat {
  icon: LucideIcon;
  label: string;
  value: number;
  change?: {
    value: number;
    direction: 'up' | 'down';
  };
  href?: string;
}

interface QuickStatsProps {
  stats: Stat[];
}

export function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          variants={fadeUp()}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
        >
          <Card className="h-full border-border/50 hover:border-primary/40 hover:bg-surface-container-low/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              {stat.change && (
                <p className="text-xs text-muted-foreground mt-1">
                  <span
                    className={
                      stat.change.direction === 'up'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {stat.change.direction === 'up' ? '+' : '-'}
                    {stat.change.value}%
                  </span>{' '}
                  vom letzten Monat
                </p>
              )}
              {!stat.change && (
                <p className="text-xs text-muted-foreground mt-1">
                  Aktuelle Inhalte im System
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
