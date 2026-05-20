import { getGenres } from "@/lib/tmdb";
import TVCard from "@/components/TVCard";

interface Props {
  searchParams: Promise<{
    genre?: string;
    year?: string;
    sort?: string;
    page?: string;
    decade?: string;
  }>;
}

const DECADES = [
  { label: "2020s", from: 2020, to: 2029 },
  { label: "2010s", from: 2010, to: 2019 },
  { label: "2000s", from: 2000, to: 2009 },
  { label: "1990s", from: 1990, to: 1999 },
  { label: "1980s", from: 1980, to: 1989 },
  { label: "1970s", from: 1970, to: 1979 },
  { label: "1960s", from: 1960, to: 1969 },
  { label: "1950s", from: 1950, to: 1959 },
  { label: "1940s", from: 1940, to: 1949 },
];

export default async function BrowseTVPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = parseInt(sp.page || "1", 10);
  const { genres } = await getGenres("tv");

  const sortMap: Record<string, string> = {
    popularity: "popularity.desc",
    rating: "vote_average.desc",
    newest: "first_air_date.desc",
    oldest: "first_air_date.asc",
    name: "name.asc",
  };

  let params: Record<string, string> = {
    page: String(page),
    sort_by: sortMap[sp.sort || "popularity"] || "popularity.desc",
  };

  if (sp.genre) params.with_genres = sp.genre;
  if (sp.decade) {
    const decade = DECADES.find((d) => d.label === sp.decade);
    if (decade) {
      params["first_air_date.gte"] = `${decade.from}-01-01`;
      params["first_air_date.lte"] = `${decade.to}-12-31`;
    }
  }
  if (sp.year) {
    params["first_air_date.gte"] = `${sp.year}-01-01`;
    params["first_air_date.lte"] = `${sp.year}-12-31`;
  }

  const data = await fetch(
    `https://api.themoviedb.org/3/discover/tv?${new URLSearchParams(params)}`,
    {
      headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN!}` },
      next: { revalidate: 600 },
    }
  ).then((r) => r.json());

  const results = data?.results || [];
  const currentGenre = genres.find((g: any) => String(g.id) === sp.genre);
  const title = currentGenre
    ? `${currentGenre.name} TV Shows`
    : sp.decade
    ? `TV Shows from the ${sp.decade}`
    : sp.year
    ? `TV Shows from ${sp.year}`
    : "All TV Shows";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">{title}</h1>

      {/* Genres */}
      <div className="flex flex-wrap gap-2 mb-6">
        <a
          href="/browse/tv"
          className={`text-xs border rounded-full px-3 py-1.5 transition ${
            !sp.genre && !sp.decade && !sp.year
              ? "bg-yellow-500 text-black border-yellow-500 font-semibold"
              : "border-zinc-700 text-zinc-400 hover:border-yellow-500 hover:text-yellow-500"
          }`}
        >
          All
        </a>
        {genres.slice(0, 20).map((g: any) => (
          <a
            key={g.id}
            href={`/browse/tv?genre=${g.id}&sort=${sp.sort || "popularity"}`}
            className={`text-xs border rounded-full px-3 py-1.5 transition ${
              String(g.id) === sp.genre
                ? "bg-yellow-500 text-black border-yellow-500 font-semibold"
                : "border-zinc-700 text-zinc-400 hover:border-yellow-500 hover:text-yellow-500"
            }`}
          >
            {g.name}
          </a>
        ))}
      </div>

      {/* Decades */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-[10px] text-zinc-600 uppercase tracking-wider self-center mr-1">Decades:</span>
        {DECADES.map((d) => (
          <a
            key={d.label}
            href={`/browse/tv?decade=${d.label}&sort=${sp.sort || "popularity"}`}
            className={`text-xs border rounded-full px-3 py-1 transition ${
              sp.decade === d.label
                ? "bg-yellow-500 text-black border-yellow-500 font-semibold"
                : "border-zinc-700 text-zinc-400 hover:border-yellow-500 hover:text-yellow-500"
            }`}
          >
            {d.label}
          </a>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Sort:</span>
        {[
          ["popularity", "Popular"],
          ["rating", "Rating"],
          ["newest", "Newest"],
          ["oldest", "Oldest"],
          ["name", "Name"],
        ].map(([key, label]) => (
          <a
            key={key}
            href={`/browse/tv?${new URLSearchParams({ ...sp, sort: key, page: "1" }).toString()}`}
            className={`text-xs border rounded px-2.5 py-1 transition ${
              (sp.sort || "popularity") === key
                ? "bg-yellow-500 text-black border-yellow-500 font-semibold"
                : "border-zinc-700 text-zinc-400 hover:border-yellow-500 hover:text-yellow-500"
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      {results.length === 0 ? (
        <p className="text-zinc-500">No shows found. Try different filters.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((s: any) => (
            <TVCard key={s.id} show={s} />
          ))}
        </div>
      )}

      {data?.total_pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          {page > 1 && (
            <a
              href={`/browse/tv?${new URLSearchParams({ ...sp, page: String(page - 1) }).toString()}`}
              className="text-sm text-zinc-400 hover:text-yellow-500 border border-zinc-700 px-4 py-2 rounded-lg transition"
            >
              ← Previous
            </a>
          )}
          <span className="text-sm text-zinc-600">
            Page {page} of {Math.min(data.total_pages, 500)}
          </span>
          {page < Math.min(data.total_pages, 500) && (
            <a
              href={`/browse/tv?${new URLSearchParams({ ...sp, page: String(page + 1) }).toString()}`}
              className="text-sm text-zinc-400 hover:text-yellow-500 border border-zinc-700 px-4 py-2 rounded-lg transition"
            >
              Next →
            </a>
          )}
        </div>
      )}

      <footer className="border-t border-zinc-800 px-4 py-8 text-center text-[10px] text-zinc-700 tracking-[0.3em] uppercase mt-12">
        RabDotFi · Powered by TMDB
      </footer>
    </div>
  );
}
