import { TagColor } from '@/types/productivity';
import { cn } from '@/lib/utils';

interface ColorTagProps {
  color: TagColor;
  className?: string;
}

const colorClasses: Record<TagColor, string> = {
  sage: 'bg-tag-sage text-tag-sage-text',
  sky: 'bg-tag-sky text-tag-sky-text',
  amber: 'bg-tag-amber text-tag-amber-text',
  rose: 'bg-tag-rose text-tag-rose-text',
  violet: 'bg-tag-violet text-tag-violet-text',
  neutral: 'bg-tag-neutral text-tag-neutral-text',
};

export function ColorTag({ color, className }: ColorTagProps) {
  return (
    <span
      className={cn(
        'inline-flex h-2 w-2 rounded-full',
        colorClasses[color],
        className
      )}
    />
  );
}

interface ColorTagSelectProps {
  value: TagColor;
  onChange: (color: TagColor) => void;
  className?: string;
}

const colors: TagColor[] = ['sage', 'sky', 'amber', 'rose', 'violet', 'neutral'];

export function ColorTagSelect({ value, onChange, className }: ColorTagSelectProps) {
  return (
    <div className={cn('flex gap-1.5', className)}>
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            'h-4 w-4 rounded-full transition-all duration-150',
            colorClasses[color],
            value === color
              ? 'ring-2 ring-foreground/30 ring-offset-1 ring-offset-background scale-110'
              : 'hover:scale-110'
          )}
        />
      ))}
    </div>
  );
}
