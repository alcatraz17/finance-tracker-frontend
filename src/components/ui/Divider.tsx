interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className = '' }: DividerProps) {
  if (!label) {
    return <div className={`w-full border-t border-[#E2E8F0] ${className}`} />;
  }

  return (
    <div className={`relative flex items-center py-1 ${className}`}>
      <div className="flex-grow border-t border-[#E2E8F0]" />
      <span className="flex-shrink-0 mx-3 text-[11px] font-semibold text-on-surface-variant tracking-wider uppercase select-none">
        {label}
      </span>
      <div className="flex-grow border-t border-[#E2E8F0]" />
    </div>
  );
}
