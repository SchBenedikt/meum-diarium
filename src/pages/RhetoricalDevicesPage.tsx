import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import rhetoricalDevicesData from '@/data/rhetorical-devices.json';

type RhetoricalDevice = {
  id: string;
  name: string;
  latinName?: string;
  category: 'figuren' | 'strukturen' | 'wirkungen' | 'argumente';
  description: string;
  detailedDescription: string;
  wirkung: string;
  example?: string;
  author?: string;
};

const categoryMeta = {
  figuren: { label: 'Figuren', classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' },
  strukturen: { label: 'Strukturen', classes: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' },
  wirkungen: { label: 'Wirkungen', classes: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300' },
  argumente: { label: 'Argumente', classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300' },
};

export default function RhetoricalDevicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categoryMeta | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const devices = rhetoricalDevicesData as RhetoricalDevice[];

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        device.name.toLowerCase().includes(q) ||
        device.latinName?.toLowerCase().includes(q) ||
        device.description.toLowerCase().includes(q) ||
        device.wirkung.toLowerCase().includes(q);

      const matchesCategory = !selectedCategory || device.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [devices, searchQuery, selectedCategory]);

  const selectedDevice = useMemo(() => {
    const fromSelection = filteredDevices.find((device) => device.id === selectedDeviceId);
    return fromSelection || filteredDevices[0] || null;
  }, [filteredDevices, selectedDeviceId]);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <main className="flex-1 container mx-auto px-4 pt-32 pb-24 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
              <div className="w-8 h-[1px] bg-primary/30" />
              RHETORIK
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight">
              Lateinische <span className="text-primary italic">Stilmittel</span>
            </h1>
            <p className="text-muted-foreground/60 max-w-xl font-light leading-relaxed">
              Lerne rhetorische Mittel über einen klaren Katalog und ein fokussiertes Trainingsmodul.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4 items-end">
            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
              <div className="flex flex-col items-end">
                <span className="text-foreground">{devices.length}</span>
                <span>Stilmittel</span>
              </div>
            </div>
            <Link to="/learn" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors pr-2">
              <ArrowLeft className="h-3.5 w-3.5" /> Zurück zum Lernen
            </Link>
          </motion.div>
        </div>

        <section className="grid lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-4 card-modern border-border/50">
              <CardContent className="p-5 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Stilmittel suchen"
                    className="pl-10 rounded-xl"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === null ? 'default' : 'outline'}
                    size="sm"
                    className="rounded-full"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Alle
                  </Button>
                  {Object.entries(categoryMeta).map(([id, meta]) => (
                    <Button
                      key={id}
                      variant={selectedCategory === id ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-full"
                      onClick={() => setSelectedCategory(id as keyof typeof categoryMeta)}
                    >
                      {meta.label}
                    </Button>
                  ))}
                </div>

                <div className="space-y-2 max-h-[520px] overflow-auto pr-1">
                  {filteredDevices.map((device) => (
                    <button
                      key={device.id}
                      onClick={() => setSelectedDeviceId(device.id)}
                      className={`w-full text-left rounded-xl border p-3 transition-colors ${
                        selectedDevice?.id === device.id
                          ? 'border-primary/40 bg-primary/10'
                          : 'border-border/50 hover:bg-secondary/40'
                      }`}
                    >
                      <p className="font-semibold text-sm">{device.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{device.latinName || '—'}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-8 card-modern border-border/50">
              <CardContent className="p-6 sm:p-8">
                {selectedDevice ? (
                  <>
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                      <Badge className={categoryMeta[selectedDevice.category].classes}>{categoryMeta[selectedDevice.category].label}</Badge>
                      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{selectedDevice.latinName || 'ohne lateinische Bezeichnung'}</span>
                    </div>
                    <h2 className="font-display text-3xl font-bold mb-4">{selectedDevice.name}</h2>
                    <p className="text-muted-foreground/80 leading-relaxed mb-5">{selectedDevice.detailedDescription}</p>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="rounded-2xl border border-border/50 bg-secondary/20 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">Wirkung</p>
                        <p className="font-medium">{selectedDevice.wirkung}</p>
                      </div>
                      <div className="rounded-2xl border border-border/50 bg-secondary/20 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">Autorischer Bezug</p>
                        <p className="font-medium">{selectedDevice.author || 'Allgemein verwendbar'}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2">Beispiel</p>
                      <p className="font-serif text-lg">{selectedDevice.example || 'Kein Beispiel hinterlegt.'}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">Keine Stilmittel für diese Filter gefunden.</p>
                )}
              </CardContent>
            </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
