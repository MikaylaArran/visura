"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Upload, Grid2X2, Menu, X, Search } from "lucide-react";
import { useState, Suspense } from "react";

function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/browse?q=${encodeURIComponent(q.trim())}`);
    } else {
      router.push("/browse");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A08060]" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search images..."
        className="pl-8 pr-4 py-2 text-sm rounded-lg border border-[#E2D8C8] bg-white focus:outline-none focus:border-[#C85A1A] w-48 lg:w-64 transition-colors"
      />
    </form>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/browse", label: "Browse", icon: <Grid2X2 size={15} /> },
    { href: "/upload", label: "Contribute", icon: <Upload size={15} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#FBF6EE]/95 backdrop-blur-sm border-b border-[#E2D8C8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 gap-4">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-xl font-bold text-[#2C1A0E] tracking-tight shrink-0"
        >
          Afri<span className="text-[#C85A1A]">Stock</span>
        </Link>

        {/* Search — hidden on mobile */}
        <div className="hidden sm:block flex-1 max-w-sm">
          <Suspense>
            <SearchInput />
          </Suspense>
        </div>

        <div className="hidden sm:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${pathname.startsWith(l.href)
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

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-[#E2D8C8] bg-[#FBF6EE] px-4 py-3 flex flex-col gap-2">
          {/* Mobile search */}
          <Suspense>
            <SearchInput />
          </Suspense>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${pathname.startsWith(l.href)
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