import { useState } from 'react';
import { Share2, Copy, Check, Twitter, Facebook, Linkedin, Mail, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  variant?: 'default' | 'compact';
}

export function ShareButton({ title, text, url, variant = 'default' }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const shareUrl = url || window.location.href;
  const shareText = text || title;

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-[#4267B2]/10 hover:text-[#4267B2]'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-[#0077B5]/10 hover:text-[#0077B5]'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`,
      color: 'hover:bg-primary/10 hover:text-primary'
    }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link kopiert!",
        description: "Der Link wurde in die Zwischenablage kopiert.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Fehler",
        description: "Der Link konnte nicht kopiert werden.",
        variant: "destructive"
      });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setIsOpen(true);
        }
      }
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className={`${
          variant === 'compact' 
            ? 'h-9 w-9 rounded-lg' 
            : 'h-10 px-4 rounded-xl gap-2'
        } inline-flex items-center justify-center bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-200`}
      >
        <Share2 className="h-4 w-4" />
        {variant !== 'compact' && <span className="text-sm font-medium">Teilen</span>}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            
            {/* Share Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-50 w-64 rounded-xl bg-card border border-border shadow-xl overflow-hidden"
            >
              <div className="p-3 border-b border-border">
                <p className="text-sm font-medium">Teilen</p>
                <p className="text-xs text-muted-foreground truncate">{title}</p>
              </div>

              <div className="p-2">
                {/* Social Links */}
                <div className="grid grid-cols-4 gap-1 mb-2">
                  {shareLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${link.color}`}
                    >
                      <link.icon className="h-5 w-5" />
                      <span className="text-[10px]">{link.name}</span>
                    </a>
                  ))}
                </div>

                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Link2 className="h-4 w-4" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">
                      {copied ? 'Kopiert!' : 'Link kopieren'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                      {shareUrl}
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
