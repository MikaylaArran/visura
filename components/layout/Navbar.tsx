"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Upload, Grid2X2, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/browse", label: "Browse", icon: <Grid2X2 size={15} /> },
    { href: "/upload", label: "Contribute", icon: <Upload size={15} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#FBF6EE]/95 backdrop-blur-sm border-b border-[#E2D8C8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-xl font-bold text-[#2C1A0E] tracking-tight"
        >
          Afri<span className="text-[#C85A1A]">Stock</span>
        </Link>

        <div className="hidden sm:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  pathname.startsWith(l.href)
                    ? "bg-[#C85A1A] text-white"
                    : "text-[#5C4A38] hover:bg-[#F5ECD8]"
                }`}
            >
              {l.icon}
              {l.label}
            </Link>
          ))}
        </div>

        <button
          className="sm:hidden p-2 rounded-lg text-[#5C4A38] hover:bg-[#F5ECD8]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="sm:hidden border-t border-[#E2D8C8] bg-[#FBF6EE] px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${
                  pathname.startsWith(l.href)
                    ? "bg-[#C85A1A] text-white"
                    : "text-[#5C4A38] hover:bg-[#F5ECD8]"
                }`}
            >
              {l.icon}
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
