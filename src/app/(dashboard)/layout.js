import Sidebar from "@/components/Sidebar";
import NotificationOverlay from "@/components/NotificationOverlay";

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <NotificationOverlay />
      <Sidebar />
      <main style={{ marginLeft: '260px', flex: 1, padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
}
