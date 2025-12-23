import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Predefined color palette
const COLOR_PALETTE = [
  // Reds
  '#EF4444', '#DC2626', '#B91C1C', '#991B1B',
  // Oranges
  '#F97316', '#EA580C', '#C2410C', '#9A3412',
  // Ambers
  '#F59E0B', '#D97706', '#B45309', '#92400E',
  // Yellows
  '#EAB308', '#CA8A04', '#A16207', '#854D0E',
  // Limes
  '#84CC16', '#65A30D', '#4D7C0F', '#3F6212',
  // Greens
  '#22C55E', '#16A34A', '#15803D', '#166534',
  // Teals
  '#14B8A6', '#0D9488', '#0F766E', '#115E59',
  // Cyans
  '#06B6D4', '#0891B2', '#0E7490', '#155E75',
  // Blues
  '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF',
  // Indigos
  '#6366F1', '#4F46E5', '#4338CA', '#3730A3',
  // Violets
  '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6',
  // Purples
  '#A855F7', '#9333EA', '#7E22CE', '#6B21A8',
  // Pinks
  '#EC4899', '#DB2777', '#BE185D', '#9D174D',
  // Roses
  '#F43F5E', '#E11D48', '#BE123C', '#9F1239',
  // Grays
  '#6B7280', '#4B5563', '#374151', '#1F2937',
];

// Map legacy TagColor to hex values
const LEGACY_COLOR_MAP: Record<string, string> = {
  sage: '#84CC16',
  sky: '#3B82F6',
  amber: '#F59E0B',
  rose: '#F43F5E',
  violet: '#8B5CF6',
  neutral: '#6B7280',
};

export function normalizeColor(color: string): string {
  // If it's a legacy color name, convert to hex
  if (LEGACY_COLOR_MAP[color]) {
    return LEGACY_COLOR_MAP[color];
  }
  // If it's already a hex color, return as-is
  if (color.startsWith('#')) {
    return color;
  }
  // Default fallback
  return '#6B7280';
}

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState('');
  const normalizedValue = normalizeColor(value);

  useEffect(() => {
    setHexInput(normalizedValue);
  }, [normalizedValue]);

  const handleColorSelect = (color: string) => {
    onChange(color);
    setIsOpen(false);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setHexInput(input);
    
    // Validate and apply if it's a valid hex color
    if (/^#[0-9A-Fa-f]{6}$/.test(input)) {
      onChange(input);
    }
  };

  const handleHexBlur = () => {
    // Reset to current value if invalid
    if (!/^#[0-9A-Fa-f]{6}$/.test(hexInput)) {
      setHexInput(normalizedValue);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'h-5 w-5 rounded-full border border-border/50 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
            className
          )}
          style={{ backgroundColor: normalizedValue }}
          aria-label="Pick a color"
        />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          {/* Color grid */}
          <div className="grid grid-cols-8 gap-1.5">
            {COLOR_PALETTE.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                className={cn(
                  'h-6 w-6 rounded-md transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring',
                  normalizedValue === color && 'ring-2 ring-foreground ring-offset-1 ring-offset-background'
                )}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>

          {/* Hex input */}
          <div className="flex gap-2">
            <div
              className="h-8 w-8 rounded-md border border-border/50 flex-shrink-0"
              style={{ backgroundColor: normalizedValue }}
            />
            <Input
              type="text"
              value={hexInput}
              onChange={handleHexChange}
              onBlur={handleHexBlur}
              placeholder="#000000"
              className="h-8 font-mono text-xs"
              maxLength={7}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Simple color dot display (non-interactive)
interface ColorDotProps {
  color: string;
  className?: string;
}

export function ColorDot({ color, className }: ColorDotProps) {
  const normalizedColor = normalizeColor(color);
  
  return (
    <span
      className={cn('inline-flex h-2 w-2 rounded-full', className)}
      style={{ backgroundColor: normalizedColor }}
    />
  );
}
