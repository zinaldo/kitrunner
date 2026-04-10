type CandySectionTitleProps = {
  children: React.ReactNode;
  className?: string;
};

export function CandySectionTitle({
  children,
  className = "",
}: CandySectionTitleProps) {
  return (
    <h3
      className={`text-xs font-bold uppercase tracking-[0.14em] text-candy-muted ${className}`}
    >
      {children}
    </h3>
  );
}
