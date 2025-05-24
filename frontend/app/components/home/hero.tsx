import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Buy & Sell Items <span className="text-blue-600 dark:text-blue-400">Directly</span> With Fellow Students
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-lg">
              Your campus marketplace for textbooks, electronics, dorm essentials, and more - all for better prices than retail.
            </p>
            <div className="flex gap-4 pt-4">
              <Link href="/discover" className="px-6 py-3 rounded-full bg-foreground text-background font-medium hover:bg-gray-800 dark:hover:bg-gray-200">
                Browse Products
              </Link>
              <Link href="/sell" className="px-6 py-3 rounded-full border border-gray-300 font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900">
                Sell an Item
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 relative h-80 md:h-96">
            <div className="absolute -top-6 -left-6 w-2/3 aspect-square rounded-2xl bg-blue-100 dark:bg-blue-900 rotate-3"></div>
            <div className="absolute -bottom-6 -right-6 w-2/3 aspect-square rounded-2xl bg-green-100 dark:bg-green-900 -rotate-6"></div>
            <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800">
              <Image 
                src="https://images.unsplash.com/photo-1713947506242-8fcae733d158?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Students exchanging items"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}