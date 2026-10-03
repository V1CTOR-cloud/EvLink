export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header>Navbar</header>

      <main>{children}</main>
    </div>
  );
}
