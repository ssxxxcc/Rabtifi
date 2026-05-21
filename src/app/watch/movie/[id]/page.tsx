import { getMovie, tmdbImage, tmdbBackdrop } from "@/lib/tmdb";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WatchMoviePage({ params }: Props) {
  const { id } = await params;
  const movie = await getMovie(parseInt(id));

  return (
    <div className="min-h-screen bg-black">
      {/* Player */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={`https://vidsrc.to/embed/movie/${id}`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Info Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <a
          href={`/movie/${movie.id}`}
          className="text-sm text-zinc-500 hover:text-yellow-500 transition inline-flex items-center gap-1 mb-4"
        >
          ← Back to {movie.title}
        </a>

        <div className="flex items-start gap-4">
          <div className="w-20 md:w-24 shrink-0">
            <div className="aspect-[2/3] bg-zinc-800 rounded-lg overflow-hidden">
              {movie.poster_path ? (
                <img src={tmdbImage(movie.poster_path, "w185") || ""} alt={movie.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-700 text-[8px]">N/A</div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-white">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 mt-1">
              {movie.release_date?.slice(0, 4) && <span>{movie.release_date.slice(0, 4)}</span>}
              {movie.runtime && <span>{movie.runtime} min</span>}
              {movie.vote_average && (
                <span className="bg-yellow-500 text-black font-bold px-1.5 py-0.5 rounded text-xs">★ {movie.vote_average.toFixed(1)}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {movie.genres?.slice(0, 4).map((g: any) => (
                <a key={g.id} href={`/search?genre=${g.id}`} className="text-[10px] border border-zinc-700 text-zinc-500 hover:text-yellow-500 px-2 py-0.5 rounded-full transition">
                  {g.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {movie.overview && (
          <p className="text-sm text-zinc-500 leading-relaxed mt-4 max-w-3xl">{movie.overview}</p>
        )}

        <footer className="border-t border-zinc-800 px-4 py-8 text-center text-[10px] text-zinc-700 tracking-[0.3em] uppercase mt-8">
          RabDotFi · Powered by TMDB
        </footer>
      </div>
    </div>
  );
}
