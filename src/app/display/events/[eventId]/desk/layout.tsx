export default function DisplayDeskLayout({
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
