import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'
import AdminStatusBar from '@/components/admin/AdminStatusBar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Fixed sidebar */}
      <AdminSidebar />

      {/* Right column: topbar + scrollable content + statusbar */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AdminTopBar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        <AdminStatusBar />
      </div>
    </div>
  )
}
