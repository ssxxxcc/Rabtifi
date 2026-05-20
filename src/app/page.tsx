import { getTrendingMovies, getPopularMovies, getNowPlaying, getTrendingTV, getPopularTV, getAiringToday, getGenres, tmdbBackdrop } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import GenreButton from "@/components/GenreButton";
import TVCard from "@/components/TVCard";

export default async function Home() {
  const [trendingMovies, popularMovies, nowPlaying, trendingTV, popularTV, airingToday, movieGenres] =
    await Promise.all([
      getTrendingMovies("week"),
      getPopularMovies(),
      getNowPlaying(),
      getTrendingTV("week"),
      getPopularTV(),
      getAiringToday(),
      getGenres("movie"),
    ]);

  const hero = trendingMovies.results[0];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${tmdbBackdrop(hero?.backdrop_path)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 pb-16 w-full">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-3">{hero?.title}</h1>
          <p className="text-zinc-400 max-w-xl line-clamp-2 mb-4">{hero?.overview}</p>
          <a
            href={`/watch/movie/${hero?.id}`}
            className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg transition"
          >
            Watch Now
          </a>
          <a
            href={`/movie/${hero?.id}`}
            className="inline-block ml-3 border border-zinc-600 hover:border-zinc-500 text-zinc-300 font-semibold px-6 py-3 rounded-lg transition"
          >
            Details
          </a>
        </div>
      </section>

      {/* Browse Genres */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-500 mb-4">Browse Movies by Genre</h2>
        <div className="flex flex-wrap gap-2">
          {movieGenres.genres.slice(0, 12).map((g: any) => (
            <GenreButton key={g.id} genre={g} />
          ))}
        </div>
      </section>

      {/* Trending Movies */}
      <Section title="Trending Movies" href="/search?trending=movie">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {trendingMovies.results.map((m: any) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      </Section>

      {/* Popular Movies */}
      <Section title="Popular Movies" href="/search?category=popular">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {popularMovies.results.map((m: any) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      </Section>

      {/* Now Playing */}
      <Section title="Now Playing" href="/search?category=now_playing">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {nowPlaying.results.map((m: any) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      </Section>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <hr className="border-zinc-800" />
      </div>

      {/* Trending TV */}
      <Section title="Trending Shows" href="/search/tv?trending=tv">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {trendingTV.results.map((s: any) => (
            <TVCard key={s.id} show={s} />
          ))}
        </div>
      </Section>

      {/* Popular TV */}
      <Section title="Popular Shows" href="/search/tv?category=popular">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {popularTV.results.map((s: any) => (
            <TVCard key={s.id} show={s} />
          ))}
        </div>
      </Section>

      {/* Airing Today */}
      <Section title="Airing Today" href="/search/tv?category=airing_today">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {airingToday.results.map((s: any) => (
            <TVCard key={s.id} show={s} />
          ))}
        </div>
      </Section>

      <footer className="border-t border-zinc-800 px-4 py-8 text-center text-[10px] text-zinc-700 tracking-[0.3em] uppercase mt-12">
        RabDotFi · Powered by TMDB
      </footer>
    </div>
  );
}

function Section({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <a href={href} className="text-xs text-yellow-500 hover:text-yellow-400 transition">View All →</a>
      </div>
      {children}
    </section>
  );
}
