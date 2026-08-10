import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <AdminSidebar />

      <div className="lg:pl-64">
        <AdminNavbar />

        <main className="min-h-[calc(100vh-5rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}