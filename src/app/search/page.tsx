import { searchMovies, getPopularMovies, getNowPlaying, getTopRatedMovies, getTrendingMovies, discoverByGenre, getGenres } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";

interface Props {
  searchParams: Promise<{ q?: string; category?: string; genre?: string; page?: string; trending?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = parseInt(sp.page || "1", 10);

  let title: string;
  let data: any;

  if (sp.q) {
    title = `Results for "${sp.q}"`;
    data = await searchMovies(sp.q, page);
  } else if (sp.category === "popular") {
    title = "Popular Movies";
    data = await getPopularMovies(page);
  } else if (sp.category === "now_playing") {
    title = "Now Playing";
    data = await getNowPlaying(page);
  } else if (sp.category === "top_rated") {
    title = "Top Rated Movies";
    data = await getTopRatedMovies(page);
  } else if (sp.genre) {
    const { genres } = await getGenres("movie");
    const genreName = genres.find((g: any) => String(g.id) === sp.genre)?.name || "Unknown";
    title = genreName;
    data = await discoverByGenre(parseInt(sp.genre), "movie", page);
  } else if (sp.trending) {
    title = "Trending Movies";
    data = await getTrendingMovies("week");
  } else {
    title = "Popular Movies";
    data = await getPopularMovies(page);
  }

  const results = data?.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">{title}</h1>

      {results.length === 0 ? (
        <p className="text-zinc-500">No movies found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((m: any) => (
            <MovieCard key={m.id} movie={m} slim />
          ))}
        </div>
      )}

      {data?.total_pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          {page > 1 && (
            <a
              href={`/search?${new URLSearchParams({ ...sp, page: String(page - 1) }).toString()}`}
              className="text-sm text-zinc-400 hover:text-yellow-500 border border-zinc-700 px-4 py-2 rounded-lg transition"
            >
              ← Previous
            </a>
          )}
          <span className="text-sm text-zinc-600">Page {page} of {Math.min(data.total_pages, 500)}</span>
          {page < Math.min(data.total_pages, 500) && (
            <a
              href={`/search?${new URLSearchParams({ ...sp, page: String(page + 1) }).toString()}`}
              className="text-sm text-zinc-400 hover:text-yellow-500 border border-zinc-700 px-4 py-2 rounded-lg transition"
            >
              Next →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
