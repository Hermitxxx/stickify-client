"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#050505] text-[#faf7f2] pt-20 pb-10 px-6 md:px-12 lg:px-16 overflow-hidden border-t border-white/10 select-none">
      <div className="max-w-7xl mx-auto flex flex-col justify-between min-h-[500px]">
        {/* Top Info & Navigation Grid matching reference layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pt-4">
          {/* Left Column: Location & Contact */}
          <div className="md:col-span-5 flex flex-col gap-8">
            {/* Location Block */}
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#9c8b7c] mb-3">
                Location
              </p>
              <p className="text-base sm:text-lg font-semibold text-[#faf7f2] leading-relaxed">
                790 Market Street, Suite 400<br />
                San Francisco, CA 94102, US
              </p>
            </div>

            {/* Contact Block */}
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#9c8b7c] mb-3">
                Contact
              </p>
              <p className="text-base sm:text-lg font-semibold text-[#faf7f2] leading-relaxed">
                support@stickify.com<br />
                +1 (800) 587-9439
              </p>
            </div>
          </div>

          {/* Middle Column: Links */}
          <div className="md:col-span-4 flex flex-col">
            <p className="text-xs font-mono uppercase tracking-widest text-[#9c8b7c] mb-5">
              Links
            </p>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Skins & Materials", href: "#devices" },
                { label: "Supported Devices", href: "#devices" },
                { label: "3D Customizer", href: "#devices" },
                { label: "Precision Guarantee", href: "#how-it-works" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#faf7f2] hover:text-[#FCAD38] transition-colors duration-300"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Socials */}
          <div className="md:col-span-3 flex flex-col">
            <p className="text-xs font-mono uppercase tracking-widest text-[#9c8b7c] mb-5">
              Socials
            </p>
            <ul className="flex flex-col gap-3">
              {[
                { name: "Instagram", href: "https://instagram.com" },
                { name: "X (Twitter)", href: "https://x.com" },
                { name: "Behance", href: "https://behance.net" },
                { name: "Dribbble", href: "https://dribbble.com" },
              ].map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#faf7f2] hover:text-[#EB7F31] transition-colors duration-300"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Giant Brand Typography Watermark matching reference */}
        <div className="mt-16 md:mt-24 overflow-hidden py-4 border-t border-white/5">
          <h1 className="text-[17vw] leading-[0.8] font-black tracking-tighter text-center select-none bg-gradient-to-b from-white/20 via-white/10 to-white/0 bg-clip-text text-transparent">
            stickify
          </h1>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#9c8b7c]">
          <p>© 2026 Stickify Inc. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Built with 3M Architectural Vinyl</span>
            <span>•</span>
            <span>0.05mm Fit Calibration</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
