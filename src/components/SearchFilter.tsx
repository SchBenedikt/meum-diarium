import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';

interface SearchFilterProps {
  value?: string;
  onChange: (query: string) => void;
  onFilter?: (filter: string) => void;
  filters?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export function SearchFilter({
  value: externalValue,
  onChange,
  onFilter,
  filters,
  placeholder = 'Suchen...',
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState(externalValue || '');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onChange(value);
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    onFilter?.(value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onChange('');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {filters && filters.length > 0 && (
        <Select value={selectedFilter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            {filters.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
