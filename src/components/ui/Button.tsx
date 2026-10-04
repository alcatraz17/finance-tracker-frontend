import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  loading = false,
  loadingText,
  fullWidth = true,
  children,
  disabled,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  const baseClasses =
    'py-3 font-headline text-xs md:text-sm font-semibold rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2 select-none';

  const variantClasses = {
    primary:
      'bg-primary-container hover:bg-[#00174a] text-white shadow-[0_4px_20px_rgba(0,35,102,0.18)] disabled:opacity-60',
    secondary:
      'bg-surface-container-low hover:bg-surface-container text-primary-container disabled:opacity-60',
    outline:
      'bg-white border border-[#E2E8F0] hover:bg-surface-container-low text-on-surface disabled:opacity-60',
    ghost:
      'bg-transparent hover:bg-surface-container-low text-primary-container disabled:opacity-60',
  }[variant];

  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses} ${widthClasses} ${className}`}
      {...rest}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{loadingText || children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
