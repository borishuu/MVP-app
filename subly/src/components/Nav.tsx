'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {useRouter} from "next/navigation";

import { useAuth } from '@/context/authContext';

const NAV_ITEMS_DISCONNECTED = [
  { href: '/login', label: 'Login' },
  { href: '/register', label: 'Register' },
];

const NAV_ITEMS_CONNECTED = [
  { href: '/', label: 'Dashboard Abonnements' },
];

const NavLink = ({ href, label, isActive }: { href: string; label: string; isActive: boolean }) => (
  <Link
    href={href}
    className={`text-center transition-transform duration-300 ${isActive ? 'font-bold transform scale-105' : 'text-base'}`}
  >
    {label}
  </Link>
);

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
        const response = await fetch('/api/user/logout');
        if (response.status === 200) {
            router.push('/login');
            setUser(null);
        } else
            console.error("Logout failed");
    } catch (error) {
        console.error("Logout failed:", error);
    }
};

  return (
    <nav className="absolute top-0 left-0 w-full bg-[#3e4756] text-white shadow-md z-50 py-4 px-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">        
        <Link href="/" className="text-2xl font-bold">
          Subly
        </Link>

        <div className="flex items-center space-x-8">
          {user ? (
            <>
              {NAV_ITEMS_CONNECTED.map(({ href, label }) => (
                <NavLink key={href} href={href} label={label} isActive={pathname === href} />
              ))}
              <button
                onClick={handleLogout}
                className="bg-red-700 hover:scale-110 text-white py-1 px-2 rounded transition duration-300 ease-in-out whitespace-nowrap"
              >
                Déconnexion
              </button>
            </>
          ) : (
            NAV_ITEMS_DISCONNECTED.map(({ href, label }) => (
              <NavLink key={href} href={href} label={label} isActive={pathname === href} />
            ))
          )}
        </div>
      </div>
    </nav>
  );
}
