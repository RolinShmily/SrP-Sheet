import { cn } from "@/lib/utils";

interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function FilterChip({ active = false, className, children, type = "button", ...props }: FilterChipProps) {
  return (
    <button
      {...props}
      type={type}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50",
        active
          ? "border-[var(--wood-dark)] bg-[var(--wood)] text-[var(--paper-soft)] shadow-[var(--shadow-tight)]"
          : "border-[var(--line)] bg-[rgba(251,246,236,0.76)] text-[var(--ink-muted)] hover:border-[var(--brass)] hover:text-[var(--ink)]",
        className
      )}
    >
      {children}
    </button>
  );
}
