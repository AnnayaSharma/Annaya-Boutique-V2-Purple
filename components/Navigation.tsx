'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { AnimatePresence, motion } from 'motion/react';
import {
  Home, ShoppingBag, Heart, ShoppingCart,
  User, Search, Menu, LogIn, LogOut, Loader2,
} from 'lucide-react';

export default function Navigation() {
  const pathname               = usePathname();
  const { cart, wishlist }     = useApp();
  const cartCount              = cart.reduce((a, i) => a + i.quantity, 0);
  const hideNav                = ['/checkout', '/success'].includes(pathname);

  if (hideNav) return null;

  const navLinks = [
    { label: 'Home',     href: '/' },
    { label: 'Shop',     href: '/shop' },
    { label: 'Wishlist', href: '/wishlist', badge: wishlist.length },
    { label: 'About',    href: '/about' },
    { label: 'Contact',  href: '/contact' },
  ];

  return (
    <>
      {/* ── Desktop / Mobile Header ──────────────────────────────────── */}
      <header className="sticky top-0 z-50 glass h-16 md:h-20 flex items-center justify-between px-4 md:px-12 border-b border-luxury-border">
        <div className="flex items-center gap-4">
          <button className="p-2 text-primary-text md:hidden"><Menu size={24} /></button>
          <Link href="/" className="text-2xl md:text-3xl font-serif font-bold tracking-widest text-royal-purple">
            ANNAYA
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}
              className={`text-sm font-medium tracking-widest uppercase transition-colors relative ${
                pathname === link.href ? 'text-royal-purple' : 'text-primary-text hover:text-royal-purple'
              }`}
            >
              {link.label}
              {link.badge !== undefined && link.badge > 0 && (
                <span className="absolute -top-2 -right-4 bg-royal-purple text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {link.badge}
                </span>
              )}
              {pathname === link.href && (
                <motion.div layoutId="header-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-royal-purple" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/search" className="p-2 text-primary-text hover:text-royal-purple transition-colors">
            <Search size={24} />
          </Link>

          <Link href="/cart" className="p-2 relative text-primary-text hover:text-royal-purple transition-colors">
            <ShoppingCart size={24} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute top-1 right-1 bg-royal-purple text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </header>

      {/* ── Mobile Bottom Nav ─────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50">
        <div className="glass rounded-full px-6 py-3 flex items-center justify-between shadow-xl shadow-royal-purple/10">
          {[
            { icon: Home,         label: 'Home',     href: '/' },
            { icon: ShoppingBag,  label: 'Shop',     href: '/shop' },
            { icon: Heart,        label: 'Wishlist', href: '/wishlist', badge: wishlist.length },
            { icon: ShoppingCart, label: 'Cart',     href: '/cart',     badge: cartCount },
          ].map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className="relative flex flex-col items-center gap-1">
                <item.icon size={22}
                  className={`transition-colors ${active ? 'text-royal-purple' : 'text-muted-text'}`} />
                <span className={`text-[10px] font-medium transition-colors ${active ? 'text-royal-purple' : 'text-muted-text'}`}>
                  {item.label}
                </span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-royal-purple text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
                {active && (
                  <motion.div layoutId="bottom-nav-indicator"
                    className="absolute -bottom-1 w-1 h-1 bg-royal-purple rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
