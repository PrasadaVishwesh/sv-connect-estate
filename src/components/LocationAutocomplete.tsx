import { useState, useRef, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { properties } from '@/data/properties';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Extract unique locations from properties
const getUniqueLocations = () => {
  const locations = new Set<string>();
  
  properties.forEach((property) => {
    locations.add(property.location.city);
    locations.add(property.location.area);
    locations.add(`${property.location.area}, ${property.location.city}`);
  });
  
  // Add some common locations for better UX
  const additionalLocations = [
    'Vijayawada',
    'Guntur',
    'Amaravati',
    'Hyderabad',
    'Visakhapatnam',
    'Chennai',
    'Bangalore',
    'Mumbai',
    'Pune',
    'Delhi',
  ];
  
  additionalLocations.forEach(loc => locations.add(loc));
  
  return Array.from(locations).sort();
};

export function LocationAutocomplete({ 
  value, 
  onChange, 
  placeholder = "Enter location...",
  className 
}: LocationAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const allLocations = getUniqueLocations();

  useEffect(() => {
    if (value.length > 0) {
      const filtered = allLocations.filter(location =>
        location.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 6);
      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
    setHighlightedIndex(-1);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          onChange(suggestions[highlightedIndex]);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (location: string) => {
    onChange(location);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const clearInput = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.length > 0 && suggestions.length > 0 && setIsOpen(true)}
        onKeyDown={handleKeyDown}
        className="w-full pl-12 pr-10 py-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
        autoComplete="off"
      />
      
      {value && (
        <button
          type="button"
          onClick={clearInput}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 animate-fade-in"
        >
          {suggestions.map((location, index) => (
            <li
              key={location}
              onClick={() => handleSelect(location)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                highlightedIndex === index
                  ? "bg-accent/10 text-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="text-sm">{location}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
