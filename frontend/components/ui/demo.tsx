'use client';

import React from 'react';
import Link from 'next/link';

export default function FooterGlow() {
  return (
    <footer className="relative z-10 mt-16 w-full overflow-hidden pt-16 pb-8">
      {/* Background ambient glowing spheres adapted to violet/indigo scheme */}
      <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-full w-full -translate-x-1/2 select-none">
        <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-[#8083ff]/10 blur-3xl"></div>
        <div className="absolute right-1/4 -bottom-24 h-80 w-80 rounded-full bg-[#6f00be]/10 blur-3xl"></div>
      </div>

      {/* Glassmorphic Footer Panel container */}
      <div className="glass-glow-footer relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-10 md:flex-row md:items-start md:justify-between md:gap-12 border border-white/5">
        
        {/* Left Column: Branding and Socials */}
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="mb-4 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#8083ff] to-[#6f00be] shadow-[0_0_15px_rgba(128,131,255,0.3)]">
              <span className="font-hanken font-bold text-sm text-white">EV</span>
            </span>
            <span className="bg-gradient-to-br from-[#c0c1ff] to-[#ddb7ff] bg-clip-text text-xl font-bold font-hanken tracking-tight text-transparent">
              EduVerse
            </span>
          </Link>
          <p className="text-[#c7c4d7] mb-6 max-w-xs text-center text-xs md:text-left leading-relaxed font-medium">
            Pioneering modern education management systems for a smarter, unified, and connected global classroom.
          </p>
          
          {/* Social Icons with indigo highlights */}
          <div className="mt-2 flex gap-4 text-[#c0c1ff]">
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.633 7.997c.013.176.013.353.013.53 0 5.387-4.099 11.605-11.604 11.605A11.561 11.561 0 010 18.29c.373.044.734.074 1.12.074a8.189 8.189 0 005.065-1.737 4.102 4.102 0 01-3.834-2.85c.25.04.5.065.765.065.37 0 .734-.049 1.08-.147A4.092 4.092 0 01.8 8.582v-.05a4.119 4.119 0 001.853.522A4.099 4.099 0 01.812 5.847c0-.02 0-.042.002-.062a11.653 11.653 0 008.457 4.287A4.62 4.62 0 0122 5.924a8.215 8.215 0 002.018-.559 4.108 4.108 0 01-1.803 2.268 8.233 8.233 0 002.368-.648 8.897 8.897 0 01-2.062 2.112z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="hover:text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .29a12 12 0 00-3.797 23.401c.6.11.82-.26.82-.577v-2.17c-3.338.726-4.042-1.415-4.042-1.415-.546-1.387-1.332-1.756-1.332-1.756-1.09-.744.084-.729.084-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.306 3.495.999.106-.775.418-1.307.76-1.608-2.665-.301-5.466-1.332-5.466-5.933 0-1.31.469-2.381 1.236-3.222-.123-.303-.535-1.523.117-3.176 0 0 1.007-.322 3.301 1.23a11.502 11.502 0 016.002 0c2.292-1.552 3.297-1.23 3.297-1.23.654 1.653.242 2.873.119 3.176.77.841 1.235 1.912 1.235 3.222 0 4.61-2.805 5.629-5.476 5.925.429.369.813 1.096.813 2.211v3.285c0 .32.217.694.825.576A12 12 0 0012 .29"></path>
              </svg>
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5v-14a5 5 0 00-5-5zm-11 19h-3v-9h3zm-1.5-10.268a1.752 1.752 0 110-3.505 1.752 1.752 0 010 3.505zm15.5 10.268h-3v-4.5c0-1.07-.02-2.450-1.492-2.450-1.495 0-1.725 1.166-1.725 2.372v4.578h-3v-9h2.88v1.23h.04a3.157 3.157 0 012.847-1.568c3.042 0 3.605 2.003 3.605 4.612v4.726z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right Section: Navigation Links */}
        <nav className="flex w-full flex-col gap-9 text-center md:w-auto md:flex-row md:justify-end md:text-left">
          <div>
            <div className="mb-3 text-[10px] font-bold tracking-widest text-[#c0c1ff] uppercase">
              Product
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features" className="text-[#c7c4d7] hover:text-white transition-colors font-medium">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-[#c7c4d7] hover:text-white transition-colors font-medium">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#portals" className="text-[#c7c4d7] hover:text-white transition-colors font-medium">
                  Portals Overview
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-[10px] font-bold tracking-widest text-[#c0c1ff] uppercase">
              Company
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#solutions" className="text-[#c7c4d7] hover:text-white transition-colors font-medium">
                  Solutions
                </a>
              </li>
              <li>
                <a href="#" className="text-[#c7c4d7] hover:text-white transition-colors font-medium">
                  Licensing Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-[#c7c4d7] hover:text-white transition-colors font-medium">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-[10px] font-bold tracking-widest text-[#c0c1ff] uppercase">
              Resources
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#" className="text-[#c7c4d7] hover:text-white transition-colors font-medium">
                  User Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-[#c7c4d7] hover:text-white transition-colors font-medium">
                  System Status
                </a>
              </li>
              <li>
                <a href="#" className="text-[#c7c4d7] hover:text-white transition-colors font-medium">
                  Support Hub
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Copy-right footer info */}
      <div className="text-[#c7c4d7]/60 relative z-10 mt-10 text-center text-[10px] font-geist tracking-wider">
        <span>&copy; 2026 EduVerse LMS Inc. All rights reserved.</span>
      </div>
    </footer>
  );
}

import { AuthForm } from "@/components/ui/premium-auth";

const DemoOne = () => {
  return <AuthForm />;
};

export { DemoOne };

