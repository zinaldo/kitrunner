export default function DisplayTvLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="candy-staff min-h-dvh bg-candy-background text-candy-ink">
      {children}
    </div>
  );
}
