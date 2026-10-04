import { Link } from 'react-router';

export interface SegmentedControlOption {
  label: string;
  value: string;
  to?: string;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  activeValue: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SegmentedControl({
  options,
  activeValue,
  onChange,
  className = '',
}: SegmentedControlProps) {
  return (
    <div
      role="tablist"
      className={`flex rounded-lg bg-surface-container-low p-1 w-full ${className}`}
    >
      {options.map((option) => {
        const isActive = option.value === activeValue;
        const baseClasses =
          'flex-1 py-2 text-center rounded-md font-headline text-xs font-semibold transition-all select-none';
        const activeClasses = 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-primary-container';
        const inactiveClasses = 'text-on-surface-variant hover:text-primary';

        if (option.to && !isActive) {
          return (
            <Link
              key={option.value}
              to={option.to}
              role="tab"
              aria-selected={false}
              className={`${baseClasses} ${inactiveClasses}`}
            >
              {option.label}
            </Link>
          );
        }

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange?.(option.value)}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
