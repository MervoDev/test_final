"use client";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Store, ShoppingBag, Locate, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm shadow-lg py-1">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
        
          <div className="flex items-center gap-2">
            <ShoppingBag size={40} className="text-black" />
          </div>

         
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-black">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/">
              <button className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm">
                <Store className="w-4 h-4" />
                Marketplace
              </button>
            </Link>

            <Link href="/cart">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm">
                <ShoppingCart className="w-5 h-5" />
                Panier
              </button>
            </Link>

            <Link href="/location">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm">
                <Locate className="w-5 h-5" />
                Location
              </button>
            </Link>
          </div>
        </div>

        {/* Menu Mobile */}
        {isOpen && (
          <div className="md:hidden flex flex-col space-y-4 mt-2 pb-4">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <button className="flex items-center gap-2 w-full justify-center bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full">
                <Store size={18} />
                Marketplace
              </button>
            </Link>
            <Link href="/cart" onClick={() => setIsOpen(false)}>
              <button className="flex items-center gap-2 w-full justify-center bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full">
                <ShoppingCart size={18} />
                Panier
              </button>
            </Link>
            <Link href="/location" onClick={() => setIsOpen(false)}>
              <button className="flex items-center gap-2 w-full justify-center bg-black text-white px-4 py-2 rounded-full">
                <Locate size={18} />
                Location
              </button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
