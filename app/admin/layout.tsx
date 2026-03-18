'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, Package, Users, ShoppingCart, 
  IndianRupee, LogOut, Menu, X, Loader2
} from 'lucide-react';

const ADMIN_LINKS = [
  { name: 'Dashboard', href: '/admin',           icon: LayoutDashboard },
  { name: 'Inventory', href: '/admin/inventory', icon: Package },
  { name: 'Orders',    href: '/admin/orders',    icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Revenue',   href: '/admin/revenue',   icon: IndianRupee },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-royal-purple text-white p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-serif font-bold text-xl">
          A
        </div>
        <div>
          <h2 className="font-serif font-bold leading-tight">Annaya Admin</h2>
          <p className="text-[10px] text-white/50 uppercase tracking-widest">Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {ADMIN_LINKS.map(link => {
          const active = pathname === link.href;
          return (
            <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${
                active ? 'bg-white text-royal-purple shadow-lg shadow-black/10' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}>
              <link.icon size={20} /> {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/20 pt-6">
        <div className="flex items-center gap-3 mb-6 px-4">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
            A
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm truncate">Admin</p>
            <p className="text-[10px] text-white/50 truncate">Portal</p>
          </div>
        </div>
        <Link href="/" className="flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-red-300 hover:bg-red-500/10 transition-colors">
          <LogOut size={20} /> Back to Store
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-lavender-bg overflow-hidden relative z-50">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 h-full flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Header & Overlay menu */}
      <div className="lg:hidden absolute top-0 left-0 right-0 h-16 bg-royal-purple text-white flex items-center justify-between px-4 z-40">
        <h1 className="font-serif font-bold">Annaya Admin</h1>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2"><Menu size={24} /></button>
      </div>
      
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl animate-in slide-in-from-left">
             <SidebarContent />
             <button onClick={() => setMobileMenuOpen(false)} className="absolute top-4 right-4 p-2 text-white/50 hover:text-white">
               <X size={24} />
             </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto pt-16 lg:pt-0 pb-12 px-4 md:px-8">
        {children}
      </main>
      
    </div>
  );
}
