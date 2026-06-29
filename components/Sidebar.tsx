'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Besoins', href: '/besoins' },
    { label: 'Produits', href: '/produits' },
    { label: 'Réversibilité', href: '/reversibilite', italic: true },
    { label: 'Maintenance', href: '/maintenance' },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[rgb(var(--card-rgb))] border-r border-[rgb(var(--card-border-rgb))] shadow-md z-40">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[rgb(var(--secondary-rgb))] mb-4">
          Menu
        </h3>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-[rgba(var(--primary-rgb),0.2)] text-[rgb(var(--primary-rgb))]'
                  : 'text-[rgb(var(--foreground-rgb))] hover:bg-[rgba(var(--background-start-rgb),0.1)]'
              }`}
            >
              <span className={item.italic ? 'italic' : ''}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
