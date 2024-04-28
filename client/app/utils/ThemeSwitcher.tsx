'use client';
import React , { useState , useEffect } from 'react'
import { useTheme } from 'next-themes'
import { BiMoon , BiSun } from 'react-icons/bi';

export const ThemeSwitcher = () => {
  const [mounted , setMounted] = useState(false);
  const {theme , setTheme} = useTheme();

  useEffect(() => {
    setMounted(true);
  } , []);

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center mx-4">
      {
        theme === 'light' ? (
          <BiMoon
            onClick={() => setTheme('dark')}
            className="cursor-pointer"
            fill='black'
            size={30}
          />
        ) : (
          <BiSun
            onClick={() => setTheme('light')}
            className="cursor-pointer"
            size={30}
          />
        )
      }
    </div>
  )
}