import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`w-full max-w-md bg-white rounded-[16px] border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,17,58,0.04)] overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, children, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-6 pt-8 pb-4 text-center ${className}`}>
      <h1 className="font-headline text-2xl md:text-3xl font-bold text-primary-container mb-6 tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xs md:text-sm text-on-surface-variant -mt-4 mb-6 font-normal">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`px-6 pb-8 ${className}`}>{children}</div>;
}
