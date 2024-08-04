'use client';

import React from 'react';
import { Bell, Menu, Search, User } from 'lucide-react';
import {ModeToggle} from "@/components/ThemeSwitcher";


interface HeaderProps {
  
}

const Header: React.FC<HeaderProps> = () => (
  <header className="flex justify-between items-center p-4 sticky top-0 backdrop-blur-xl shadow-sm z-50 ">

    <div className="text-2xl font-bold">
          Math
    </div>


    <div className="flex items-center space-x-4 ">
      <Bell className="w-5 h-5 text-gray-500 cursor-pointer" />
      <User className="w-5 h-5 text-gray-500 cursor-pointer" />
      <ModeToggle />
    </div>
  </header>
);

export default Header;