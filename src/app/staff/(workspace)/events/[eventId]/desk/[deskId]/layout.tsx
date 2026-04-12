export default function StaffDeskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="candy-staff min-h-[calc(100vh-5rem)] rounded-candy border border-candy-outline/10 bg-candy-background px-4 py-6 shadow-candy-card-soft sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      {children}
    </div>
  );
}
