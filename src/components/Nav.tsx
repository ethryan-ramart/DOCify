"use client"

import { cn } from '@/lib/utils';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { ComponentProps, Profiler, ReactNode, useState } from 'react'
import { ProfileDrawer } from "@/components/ProfileDrawer"

export function Nav({ children, AuthButton, showProfile }: { children: ReactNode, AuthButton: ReactNode, showProfile: any }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <nav className="sticky w-full z-50 top-0 start-0 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2 lg:p-0">
        <a href="/" className="flex items-center p-2 text-sm">
          <div >
            <h1 className="text-lg font-bold">DOC<span className="bg-cyan-400 p-1 rounded" style={{color:'#020817'}}>ify</span></h1>
          </div>
        </a>

        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {showProfile !== null
            ? <span className='hidden md:block'>
              <ProfileDrawer _AuthButton={AuthButton} user={showProfile} />
            </span>
            : AuthButton}
          {
            showProfile
            && <button onClick={handleMenuToggle} data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
          }
        </div>

        <div className={cn("items-end md:justify-between w-full flex-col md:flex md:flex-row md:w-auto md:order-1", menuOpen ? "flex" : "hidden")} id="navbar-sticky">
          {children}
          {
            showProfile && <span className='md:hidden'> <ProfileDrawer _AuthButton={AuthButton} user={showProfile} /></span>
          }
        </div>
      </div>
    </nav>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname()
  return <Link {...props} className={cn("p-4 transition-colors hover:text-foreground/80 text-foreground/60", pathname === props.href && "text-foreground underline font-bold")} />
}