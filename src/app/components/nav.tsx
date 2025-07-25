"use client"
import Link from 'next/link';

import { ShoppingCart, Store, ShoppingBag,Locate } from "lucide-react";

export default function Navbar() {
    return (
        <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300 shadow-lg py-1">
            <nav className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    <div className="font-bold  bg-clip-text text-transparent w-16 h-16 flex items-center gap-2  ">
                        <ShoppingBag size={40} className="text-black" />
                        
                    </div>
                    <div className="hidden md:flex items-center space-x-6">
                            {/* <Link href="/" className="text-gray-700 hover:text-rose-600 transition-colors text-sm">Accueil</Link> */}


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
                        
                        <Link href="/cart">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm">
                                <Locate className="w-5 h-5" />
                               Location
                            </button>

                        </Link>
                    </div>

                </div>
            </nav>
        </header>
    )
}
