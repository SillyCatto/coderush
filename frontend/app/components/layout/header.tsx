"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Check for user on mount and when localStorage changes
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // Handle invalid JSON
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      // Call logout endpoint
      await axios.post("http://localhost:4000/api/auth/logout", {}, {
        withCredentials: true 
      });
      
      // Clear user from localStorage
      localStorage.removeItem('user');
      setUser(null);
      
      // Redirect to home
      router.push('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 dark:bg-black/80 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image 
            src="/vercel.svg" 
            alt="Campus Marketplace" 
            width={32} 
            height={32}
            className="dark:invert" 
          />
          <span className="font-bold text-lg">Campus++</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300">Home</Link>
          <Link href="/discover" className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300">Discover</Link>
          <Link href="/meetInCampus" className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300">Meet in Campus</Link>
          <Link href="/sell" className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300">Sell</Link>
        </nav>
        
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex gap-2">
                  <User className="h-4 w-4" />
                  {user.name?.split(' ')[0] || 'User'}
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <Link href="/userProfile">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">Log In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}