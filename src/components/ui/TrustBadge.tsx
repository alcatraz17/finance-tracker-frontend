interface TrustBadgeProps {
  text: string;
  icon?: string;
  className?: string;
}

export function TrustBadge({
  text,
  icon = 'shield',
  className = '',
}: TrustBadgeProps) {
  return (
    <div
      className={`mt-8 flex items-center justify-center gap-1.5 text-primary-container text-xs font-medium select-none ${className}`}
    >
      <span className="material-symbols-outlined text-[16px] text-primary-container" aria-hidden="true">
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}
