import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface BulkActionsProps {
  selectedItems: string[];
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onDelete?: (ids: string[]) => void;
  onExport?: (ids: string[]) => void;
  totalItems: number;
}

export function BulkActions({
  selectedItems,
  onSelectAll,
  onDeselectAll,
  onDelete,
  onExport,
  totalItems,
}: BulkActionsProps) {
  const [action, setAction] = useState<string>('');

  const handleApply = () => {
    if (!action) {
      toast.error('Bitte wähle eine Aktion aus');
      return;
    }

    if (selectedItems.length === 0) {
      toast.error('Bitte wähle mindestens ein Element aus');
      return;
    }

    switch (action) {
      case 'delete':
        if (window.confirm(`${selectedItems.length} Element(e) wirklich löschen?`)) {
          onDelete?.(selectedItems);
          toast.success(`${selectedItems.length} Element(e) gelöscht`);
        }
        break;
      case 'export':
        onExport?.(selectedItems);
        toast.success(`${selectedItems.length} Element(e) exportiert`);
        break;
      default:
        toast.info('Aktion nicht implementiert');
    }
    
    setAction('');
  };

  const allSelected = selectedItems.length === totalItems && totalItems > 0;
  const someSelected = selectedItems.length > 0 && selectedItems.length < totalItems;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-2 border-b border-border">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={allSelected}
          onCheckedChange={() => {
            if (allSelected || someSelected) {
              onDeselectAll?.();
            } else {
              onSelectAll?.();
            }
          }}
          aria-label="Alle auswählen"
        />
        <span className="text-sm text-muted-foreground">
          {selectedItems.length > 0 ? (
            <span className="font-medium text-foreground">
              {selectedItems.length} ausgewählt
            </span>
          ) : (
            'Alle auswählen'
          )}
        </span>
      </div>

      {selectedItems.length > 0 && (
        <div className="flex items-center gap-2 flex-1">
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Massenaktionen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="delete">Löschen</SelectItem>
              <SelectItem value="export">Exportieren</SelectItem>
              <SelectItem value="duplicate">Duplizieren</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleApply} variant="outline" size="sm">
            Anwenden
          </Button>
          <Button
            onClick={onDeselectAll}
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
          >
            Auswahl aufheben
          </Button>
        </div>
      )}
    </div>
  );
}
