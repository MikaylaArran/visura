"use client";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export default function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [, startTransition] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams(params.toString());
    if (query.trim()) {
      p.set("q", query.trim());
    } else {
      p.delete("q");
    }
    startTransition(() => router.push(`/browse?${p.toString()}`));
  };

  const clear = () => {
    setQuery("");
    const p = new URLSearchParams(params.toString());
    p.delete("q");
    startTransition(() => router.push(`/browse?${p.toString()}`));
  };

  return (
    <form onSubmit={submit} className="relative w-full max-w-xl">
      <div className="flex items-center bg-white border border-[#E2D8C8] rounded-xl shadow-sm overflow-hidden focus-within:border-[#C85A1A] transition-colors">
        <Search size={16} className="ml-4 text-[#A08060] flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search images, places, culture…"
          className="flex-1 px-3 py-3 text-sm bg-transparent outline-none text-[#2C1A0E] placeholder:text-[#C4A882]"
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            className="mr-2 p-1 rounded-full text-[#A08060] hover:text-[#2C1A0E] transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
        <button
          type="submit"
          className="m-1.5 px-4 py-2 bg-[#C85A1A] text-white text-sm font-medium rounded-lg hover:bg-[#A8481A] transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
