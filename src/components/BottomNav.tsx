'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wine, User } from 'lucide-react';

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="absolute bottom-0 w-full h-16 bg-[#222421] border-t border-border flex items-center justify-around px-6 z-50">
            <Link 
                href="/" 
                className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
                <Home size={20} />
                <span className="text-[10px] uppercase tracking-widest font-semibold">Archive</span>
            </Link>
            
            <Link 
                href="/my-bar" 
                className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/my-bar' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
                <Wine size={20} />
                <span className="text-[10px] uppercase tracking-widest font-semibold">My Bar</span>
            </Link>
            <a 
                href="/profile" 
                className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/profile' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
                <User size={20} />
                <span className="text-[10px] uppercase tracking-widest font-semibold">Curator</span>
            </a>
        </nav>
    );
}
