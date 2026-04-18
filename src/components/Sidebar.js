"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LayoutDashboard, Users, Calendar, UserCircle, CheckSquare, Settings, BarChart2, FileText, Save } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
    { name: "Perf. Report", href: "/performance-report", icon: FileText },
    { name: "Work Audit", href: "/work-report", icon: Save },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Task Board", href: "/tasks", icon: CheckSquare },
  ];

  if (role === "admin" || role === "senior") {
    navItems.push({ name: "Employees", href: "/employees", icon: UserCircle });
    navItems.push({ name: "Settings", href: "/settings", icon: Settings });
  }

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      padding: '2rem 0',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      maxHeight: '100vh',
      overflowY: 'auto',
      position: 'fixed'
    }}>
      <div style={{ padding: '0 2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          <span style={{ color: 'var(--accent-blue)' }}>24</span> Digitals
        </h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: isActive ? 'var(--accent-blue)' : 'transparent',
              color: isActive ? '#fff' : 'var(--text-secondary)',
              transition: 'var(--transition)',
              fontWeight: isActive ? 500 : 400
            }}>
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', padding: '1rem 2rem', borderTop: '1px solid var(--border-color)', opacity: 0.6 }}>
        <p style={{ fontSize: '0.75rem', fontWeight: '500' }}>v2.0 - April 2026</p>
        <p style={{ fontSize: '0.65rem' }}>Update Active</p>
      </div>
    </aside>
  );
}
