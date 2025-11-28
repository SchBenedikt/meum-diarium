import { useState } from 'react';
import { Share2, Copy, Check, Facebook, Linkedin, Mail, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';


// Custom Icons for WhatsApp, Telegram and X
const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);

const TelegramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M15 10l-4 4 6 6 4-16-18 7 4 2 2 6 3-4"></path></svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);


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
  const defaultShareText = `Hey, schaut, was ich hier gefunden habe: ${shareUrl}`;

  const shareLinks = [
    {
      name: 'X',
      icon: XIcon,
      url: `https://x.com/intent/tweet?text=${encodeURIComponent(defaultShareText)}`,
      color: 'hover:bg-foreground/10 hover:text-foreground'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(defaultShareText)}`,
      color: 'hover:bg-[#4267B2]/10 hover:text-[#4267B2]'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-[#0077B5]/10 hover:text-[#0077B5]'
    },
    {
      name: 'WhatsApp',
      icon: WhatsAppIcon,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(defaultShareText)}`,
      color: 'hover:bg-[#25D366]/10 hover:text-[#25D366]'
    },
    {
      name: 'Telegram',
      icon: TelegramIcon,
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(defaultShareText)}`,
      color: 'hover:bg-[#0088cc]/10 hover:text-[#0088cc]'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(defaultShareText)}`,
      color: 'hover:bg-primary/10 hover:text-primary'
    }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link in die Zwischenablage kopiert!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Der Link konnte nicht kopiert werden.");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: defaultShareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          // If native share fails for other reasons, open the custom menu
          setIsOpen(true);
        }
      }
    } else {
      // Fallback to custom menu if native share is not supported
      setIsOpen(true);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        aria-label="Inhalt teilen"
        className={cn(
          'inline-flex items-center justify-center bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-200',
          variant === 'compact' 
            ? 'h-9 w-9 rounded-lg' 
            : 'h-10 px-4 rounded-xl gap-2'
        )}
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
              className="fixed inset-0 z-40 bg-transparent"
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
                      className={cn(
                        'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors text-muted-foreground',
                        link.color
                      )}
                    >
                      <link.icon />
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
                      <Link2 className="h-4 w-4 text-muted-foreground" />
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
