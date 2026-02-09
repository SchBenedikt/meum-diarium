import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Send, X } from 'lucide-react';

interface CommentFormProps {
  onSubmit: (content: string, guestData?: { name: string; email: string }) => void;
  isSubmitting: boolean;
  placeholder?: string;
  showGuestFields?: boolean;
  onCancel?: () => void;
  submitButtonText?: string;
  showCancel?: boolean;
}

export function CommentForm({ 
  onSubmit, 
  isSubmitting, 
  placeholder = "Schreiben Sie Ihren Kommentar...",
  showGuestFields = false,
  onCancel,
  submitButtonText = "Kommentieren",
  showCancel = false
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    if (showGuestFields) {
      if (!guestName.trim() || !guestEmail.trim()) {
        return;
      }
      
      onSubmit(content, { name: guestName.trim(), email: guestEmail.trim() });
    } else {
      onSubmit(content);
    }
    
    // Reset form
    setContent('');
    if (showGuestFields) {
      setGuestName('');
      setGuestEmail('');
    }
  };

  const isDisabled = isSubmitting || !content.trim() || (showGuestFields && (!guestName.trim() || !guestEmail.trim()));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {showGuestFields && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guestName">Name *</Label>
            <Input
              id="guestName"
              type="text"
              placeholder="Ihr Name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guestEmail">E-Mail *</Label>
            <Input
              id="guestEmail"
              type="email"
              placeholder="ihre@email.de"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="comment">Kommentar *</Label>
        <Textarea
          id="comment"
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          rows={4}
          className="resize-none"
          maxLength={2000}
        />
        <div className="text-xs text-muted-foreground text-right">
          {content.length}/2000 Zeichen
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {showGuestFields 
            ? "Ihr Name und E-Mail werden mit dem Kommentar angezeigt. Die E-Mail wird nicht veröffentlicht."
            : "Ihr Kommentar wird mit Ihrem Benutzernamen veröffentlicht."
          }
        </p>
        
        <div className="flex items-center gap-2">
          {(showCancel || onCancel) && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Abbrechen
            </Button>
          )}
          
          <Button
            type="submit"
            disabled={isDisabled}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Wird gesendet...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {submitButtonText}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
