import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
  error?: string;
  isPassword?: boolean;
  rightAction?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, icon, error, isPassword = false, type = 'text', rightAction, className = '', id, ...rest },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor={inputId}
            className="block font-headline text-xs font-semibold text-on-surface uppercase tracking-wider"
          >
            {label}
          </label>
          {rightAction}
        </div>
      )}

      <div className="relative">
        {icon && (
          <span
            className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none select-none"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={effectiveType}
          aria-invalid={Boolean(error)}
          className={`w-full py-2.5 bg-white border rounded-xl text-on-surface text-sm outline-none transition-all ${
            icon ? 'pl-11' : 'pl-4'
          } ${isPassword ? 'pr-12' : 'pr-4'} ${
            error
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-[#E2E8F0] focus:border-primary-container focus:ring-2 focus:ring-primary-container/20'
          } ${className}`}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors text-xs font-medium px-1 py-0.5 select-none"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-600 mt-1.5 font-medium">{error}</p>}
    </div>
  );
});
