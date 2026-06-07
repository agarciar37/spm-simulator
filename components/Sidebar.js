"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const items = [
    { label: "Dashboard", href: "/" },
    { label: "Demandas", href: "/" },
    { label: "Proyectos", href: "/" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>SPM</h2>
        <span>Simulator</span>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={pathname === item.href ? "active" : ""}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>Álvaro García</p>
      </div>
    </aside>
  );
}