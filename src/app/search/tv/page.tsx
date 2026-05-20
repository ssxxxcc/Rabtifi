import { searchTV, getPopularTV, getTopRatedTV, getAiringToday, getOnTheAir, getTrendingTV, discoverByGenre, getGenres } from "@/lib/tmdb";
import TVCard from "@/components/TVCard";

interface Props {
  searchParams: Promise<{ q?: string; category?: string; genre?: string; page?: string; trending?: string }>;
}

export default async function SearchTVPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = parseInt(sp.page || "1", 10);

  let title: string;
  let data: any;

  if (sp.q) {
    title = `TV Results for "${sp.q}"`;
    data = await searchTV(sp.q, page);
  } else if (sp.category === "popular") {
    title = "Popular Shows";
    data = await getPopularTV(page);
  } else if (sp.category === "top_rated") {
    title = "Top Rated Shows";
    data = await getTopRatedTV(page);
  } else if (sp.category === "airing_today") {
    title = "Airing Today";
    data = await getAiringToday(page);
  } else if (sp.category === "on_the_air") {
    title = "On The Air";
    data = await getOnTheAir(page);
  } else if (sp.genre) {
    const { genres } = await getGenres("tv");
    const genreName = genres.find((g: any) => String(g.id) === sp.genre)?.name || "Unknown";
    title = `${genreName} Shows`;
    data = await discoverByGenre(parseInt(sp.genre), "tv", page);
  } else if (sp.trending) {
    title = "Trending Shows";
    data = await getTrendingTV("week");
  } else {
    title = "Popular Shows";
    data = await getPopularTV(page);
  }

  const results = data?.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">{title}</h1>

      {results.length === 0 ? (
        <p className="text-zinc-500">No shows found.</p>
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
            <a href={`/search/tv?${new URLSearchParams({ ...sp, page: String(page - 1) }).toString()}`}
               className="text-sm text-zinc-400 hover:text-yellow-500 border border-zinc-700 px-4 py-2 rounded-lg transition">
              ← Previous
            </a>
          )}
          <span className="text-sm text-zinc-600">Page {page} of {Math.min(data.total_pages, 500)}</span>
          {page < Math.min(data.total_pages, 500) && (
            <a href={`/search/tv?${new URLSearchParams({ ...sp, page: String(page + 1) }).toString()}`}
               className="text-sm text-zinc-400 hover:text-yellow-500 border border-zinc-700 px-4 py-2 rounded-lg transition">
              Next →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
