"use client";

import { useState } from 'react';
import { Menu, X, Bell, HelpCircle, Settings, LogOut, User } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="bg-[#1F4878] text-white p-8 flex justify-between items-center relative">
            {/* Navigation Links */}
            <nav className="hidden lg:flex lg:space-x-8 lg:items-center w-full justify-center">
                <Link href="#" className="text-white hover:text-green-400">Home</Link>
                <Link href="#" className="text-white hover:text-green-400">Policy Purchase</Link>
                <Link href="#" className="text-white hover:text-green-400">Claim Submission</Link>
                <Link href="#" className="text-white hover:text-green-400">Claim Status</Link>
                <Link href="#" className="text-white hover:text-green-400">About Us</Link>
            </nav>

            {/* Bell Icon - Right of header on large screens */}
            <div className="hidden lg:block absolute right-4">
                <Bell size={24} className="cursor-pointer" />
            </div>

            {/* Conditional Hamburger / X Button */}
            <button
                className="lg:hidden absolute top-4 right-4"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="lg:hidden absolute top-4 right-16">
                <Bell size={24} className="cursor-pointer" />
            </div>

            <div className="lg:hidden absolute top-4 right-28">
                <User size={24} className="cursor-pointer" />
            </div>


            {menuOpen && (
                <nav className="w-full bg-[#0F3B60] flex flex-col items-center space-y-4 p-8 lg:hidden">
                    <Link href="#" className="text-white hover:text-green-400">Home</Link>
                    <Link href="#" className="text-white hover:text-green-400">Policy Purchase</Link>
                    <Link href="#" className="text-white hover:text-green-400">Claim Submission</Link>
                    <Link href="#" className="text-white hover:text-green-400">Claim Status</Link>
                    <Link href="#" className="text-white hover:text-green-400">About Us</Link>
                    <div className="flex justify-center gap-4 mt-4">
                        <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600">
                            <HelpCircle size={24} />
                        </button>
                        <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600">
                            <Settings size={24} />
                        </button>
                        <button className="p-2 bg-gray-700 rounded-full hover:bg-red-500">
                            <LogOut size={24} />
                        </button>

                    </div>
                </nav>
            )}
        </header>
    );
}
