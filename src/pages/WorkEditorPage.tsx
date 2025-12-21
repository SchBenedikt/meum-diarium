import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useParams } from 'react-router-dom';
import { works } from '@/data/works';
import { BookMarked, Construction } from 'lucide-react';

export default function WorkEditorPage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();

  const work = useMemo(() => slug ? works[slug] : undefined, [slug]);

  return (
    <div className="container mx-auto max-w-4xl px-4 pt-24 sm:pt-28 pb-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <BookMarked className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold">Werke</h1>
        </div>
        <p className="text-muted-foreground">Bearbeite literarische Werke (Titel, Autor, Jahr, Zusammenfassung, Struktur).</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{work ? 'Werk bearbeiten' : 'Neues Werk'}</CardTitle>
          <CardDescription>Basisdaten und Zusammenfassung</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Slug</label>
              <Input defaultValue={slug || ''} placeholder="z. B. de-bello-gallico" />
            </div>
            <div>
              <label className="text-sm font-medium">Autor</label>
              <Input defaultValue={work?.author || ''} placeholder="caesar | cicero | augustus | seneca" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Titel</label>
            <Input defaultValue={work?.title || ''} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Jahr(e)</label>
              <Input defaultValue={work?.year || ''} />
            </div>
            <div>
              <label className="text-sm font-medium">Zentrale Aussage</label>
              <Input defaultValue={work?.takeaway || ''} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Zusammenfassung</label>
            <Textarea rows={5} defaultValue={work?.summary || ''} />
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700">
            <Construction className="h-4 w-4" />
            <span className="text-sm">Speichern/Löschen folgt in Kürze. Diese Ansicht dient als Vorschau.</span>
          </div>
          <div className="flex gap-2">
            <Button disabled>Speichern</Button>
            <Button variant="outline" onClick={() => navigate('/admin')}>Zurück</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
