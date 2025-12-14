import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Link as LinkIcon, Upload, Check } from 'lucide-react';
import { toast } from 'sonner';

interface MediaLibraryProps {
  onSelect: (url: string) => void;
  trigger?: React.ReactNode;
}

export function MediaLibrary({ onSelect, trigger }: MediaLibraryProps) {
  const [open, setOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Sample images - in a real app, these would come from an API
  const sampleImages = [
    'https://images.unsplash.com/photo-1523568129082-c0023f0e9c95',
    'https://images.unsplash.com/photo-1576086213369-97a306d36557',
    'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b',
    'https://images.unsplash.com/photo-1589389678218-780c66c9a5f3',
    'https://images.unsplash.com/photo-1548264125-86e82ceec6a6',
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
  ];

  const handleUrlSubmit = () => {
    if (!urlInput) {
      toast.error('Bitte gib eine URL ein');
      return;
    }
    onSelect(urlInput);
    setOpen(false);
    setUrlInput('');
    toast.success('Bild-URL übernommen');
  };

  const handleImageSelect = (url: string) => {
    setSelectedImage(url);
  };

  const handleConfirmSelection = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      setOpen(false);
      setSelectedImage(null);
      toast.success('Bild ausgewählt');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button" variant="outline">
            <Image className="mr-2 h-4 w-4" />
            Bild auswählen
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Medienbibliothek</DialogTitle>
          <DialogDescription>
            Wähle ein Bild aus oder gib eine URL ein
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="library">
              <Image className="h-4 w-4 mr-2" />
              Bibliothek
            </TabsTrigger>
            <TabsTrigger value="url">
              <LinkIcon className="h-4 w-4 mr-2" />
              URL
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Hochladen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {sampleImages.map((url, index) => (
                <div
                  key={index}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedImage === url
                      ? 'border-primary ring-2 ring-primary ring-offset-2'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleImageSelect(url)}
                >
                  <img
                    src={url}
                    alt={`Sample ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {selectedImage === url && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {selectedImage && (
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedImage(null)}>
                  Abbrechen
                </Button>
                <Button onClick={handleConfirmSelection}>
                  Bild verwenden
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="url" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Bild-URL</Label>
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>
            {urlInput && (
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Vorschau:</p>
                <img
                  src={urlInput}
                  alt="Preview"
                  className="w-full max-h-48 object-contain rounded"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EBild nicht verfügbar%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setUrlInput('')}>
                Zurücksetzen
              </Button>
              <Button onClick={handleUrlSubmit}>
                URL verwenden
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4 mt-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Drag & Drop oder klicke zum Hochladen
              </p>
              <Input
                type="file"
                accept="image/*"
                className="max-w-xs mx-auto"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // In a real app, you would upload to a server
                    // For now, create a local URL
                    const url = URL.createObjectURL(file);
                    onSelect(url);
                    setOpen(false);
                    toast.success('Bild hochgeladen');
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-4">
                Unterstützte Formate: JPG, PNG, GIF, WebP
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
