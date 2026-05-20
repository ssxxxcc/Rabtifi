"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const isTV = pathname?.startsWith("/tv") || pathname?.startsWith("/search/tv") || pathname?.startsWith("/watch/tv") || pathname?.startsWith("/browse/tv");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const base = isTV ? "/search/tv" : "/search";
      router.push(`${base}?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        <a href="/" className="text-xl font-bold tracking-tight text-white shrink-0">
          <span className="text-yellow-400">Rab</span>DotFi
        </a>

        <div className="flex items-center gap-1 text-sm">
          <a
            href="/browse"
            className={`px-3 py-1.5 rounded transition ${isTV ? "text-zinc-500 hover:text-zinc-300" : "text-yellow-500 bg-yellow-500/10"}`}
          >
            Movies
          </a>
          <a
            href="/browse/tv"
            className={`px-3 py-1.5 rounded transition ${isTV ? "text-yellow-500 bg-yellow-500/10" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            TV
          </a>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 max-w-md ml-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${isTV ? "shows" : "movies"}...`}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500 transition"
          />
        </form>
      </div>
    </nav>
  );
}
