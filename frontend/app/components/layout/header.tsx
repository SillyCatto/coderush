import Image from "next/image";
import Link from "next/link";

export default function Header() {
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
        
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900">
            Log In
          </Link>
          <Link href="/register" className="text-sm font-medium px-4 py-2 rounded-full bg-foreground text-background hover:bg-gray-800 dark:hover:bg-gray-200">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}