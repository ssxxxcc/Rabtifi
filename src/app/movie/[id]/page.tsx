import { getMovie, tmdbImage, tmdbBackdrop } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  const movie = await getMovie(parseInt(id));

  const img = tmdbImage(movie.poster_path, "w500");
  const backdrop = tmdbBackdrop(movie.backdrop_path);
  const year = movie.release_date?.slice(0, 4) || "";
  const rating = movie.vote_average?.toFixed(1);
  const trailer = movie.videos?.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  );
  const cast = movie.credits?.cast?.slice(0, 12) || [];
  const directors = movie.credits?.crew?.filter((c: any) => c.job === "Director") || [];

  return (
    <div>
      {/* Backdrop */}
      <div className="relative h-[50vh] min-h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-top"
          style={{ backgroundImage: `url(${backdrop})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-40 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0 w-48 md:w-64">
            <div className="aspect-[2/3] bg-zinc-800 rounded-xl overflow-hidden shadow-2xl">
              {img ? (
                <img src={img} alt={movie.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-700 text-sm p-4 text-center">{movie.title}</div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-4 md:pt-16">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-zinc-500 italic mb-4">{movie.tagline}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
              {rating && (
                <span className="bg-yellow-500 text-black font-bold px-2 py-0.5 rounded text-xs">
                  ★ {rating}
                </span>
              )}
              {year && <span className="text-zinc-400">{year}</span>}
              {movie.runtime && <span className="text-zinc-400">{movie.runtime} min</span>}
              {movie.status && <span className="text-zinc-600 uppercase tracking-wider text-[10px]">{movie.status}</span>}
              {movie.spoken_languages?.[0] && (
                <span className="text-zinc-600 text-[10px] uppercase">{movie.spoken_languages[0].english_name}</span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres?.map((g: any) => (
                <a
                  key={g.id}
                  href={`/search?genre=${g.id}`}
                  className="text-xs border border-zinc-700 text-zinc-400 hover:border-yellow-500 hover:text-yellow-500 px-3 py-1 rounded-full transition"
                >
                  {g.name}
                </a>
              ))}
            </div>

            {/* Overview */}
            {movie.overview && (
              <div className="mb-6">
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Overview</h3>
                <p className="text-zinc-400 leading-relaxed text-sm max-w-2xl">{movie.overview}</p>
              </div>
            )}

            {/* Directors */}
            {directors.length > 0 && (
              <p className="text-sm text-zinc-500 mb-4">
                <span className="text-zinc-600">Director: </span>
                {directors.map((d: any) => d.name).join(", ")}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href={`/watch/movie/${movie.id}`}
                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg transition"
              >
                ▶ Watch Now
              </a>
              {trailer && (
                <a
                  href={trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-semibold px-6 py-3 rounded-lg transition text-sm"
                >
                  Trailer
                </a>
              )}
              {movie.homepage && (
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-semibold px-6 py-3 rounded-lg transition text-sm"
                >
                  Official Site
                </a>
              )}
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 text-sm">
              {movie.budget > 0 && (
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Budget</p>
                  <p className="text-zinc-400">${(movie.budget / 1_000_000).toFixed(0)}M</p>
                </div>
              )}
              {movie.revenue > 0 && (
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Revenue</p>
                  <p className="text-zinc-400">${(movie.revenue / 1_000_000).toFixed(0)}M</p>
                </div>
              )}
              {movie.vote_count > 0 && (
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Votes</p>
                  <p className="text-zinc-400">{movie.vote_count.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-white mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {cast.map((c: any) => (
                <div key={c.id} className="flex-shrink-0 w-24 text-center">
                  <div className="w-24 h-24 rounded-full bg-zinc-800 overflow-hidden mx-auto mb-2">
                    {c.profile_path ? (
                      <img
                        src={tmdbImage(c.profile_path, "w185") || ""}
                        alt={c.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700 text-[8px]">
                        {c.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-zinc-300 truncate">{c.name}</p>
                  <p className="text-[10px] text-zinc-600 truncate">{c.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommendations */}
        {movie.recommendations?.results?.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-white mb-4">You Might Also Like</h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {movie.recommendations.results.slice(0, 10).map((m: any) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </section>
        )}

        <footer className="border-t border-zinc-800 px-4 py-8 text-center text-[10px] text-zinc-700 tracking-[0.3em] uppercase mt-12">
          RabDotFi · Powered by TMDB
        </footer>
      </div>
    </div>
  );
}
