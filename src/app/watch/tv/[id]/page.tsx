import { getTVShow, getTVSeason, tmdbImage } from "@/lib/tmdb";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ season?: string; episode?: string }>;
}

export default async function WatchTVPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const seasonNum = parseInt(sp.season || "1", 10);
  const episodeNum = parseInt(sp.episode || "1", 10);
  const show = await getTVShow(parseInt(id));
  const seasonData = await getTVSeason(parseInt(id), seasonNum).catch(() => null);

  const currentEp = seasonData?.episodes?.find((e: any) => e.episode_number === episodeNum);
  const episodeCount = seasonData?.episodes?.length || 0;
  const nextEp = seasonData?.episodes?.find((e: any) => e.episode_number === episodeNum + 1);
  const prevEp = seasonData?.episodes?.find((e: any) => e.episode_number === episodeNum - 1);

  return (
    <div className="min-h-screen bg-black">
      {/* Player */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={`https://vidsrc.to/embed/tv/${id}/${seasonNum}-${episodeNum}`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
      </div>

      {/* Info Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <a
          href={`/tv/${show.id}?season=${seasonNum}`}
          className="text-sm text-zinc-500 hover:text-yellow-500 transition inline-flex items-center gap-1 mb-4"
        >
          ← Back to {show.name}
        </a>

        {/* Episode Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              {show.name}
            </h1>
            <p className="text-sm text-zinc-500">
              Season {seasonNum} · Episode {episodeNum}{currentEp?.name ? ` · ${currentEp.name}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {prevEp && (
              <a
                href={`/watch/tv/${id}?season=${seasonNum}&episode=${episodeNum - 1}`}
                className="text-xs border border-zinc-700 text-zinc-400 hover:text-yellow-500 hover:border-yellow-500 px-3 py-1.5 rounded transition"
              >
                ← Prev
              </a>
            )}
            {nextEp && (
              <a
                href={`/watch/tv/${id}?season=${seasonNum}&episode=${episodeNum + 1}`}
                className="text-xs bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-3 py-1.5 rounded transition"
              >
                Next →
              </a>
            )}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-20 md:w-24 shrink-0">
            <div className="aspect-[2/3] bg-zinc-800 rounded-lg overflow-hidden">
              {show.poster_path ? (
                <img src={tmdbImage(show.poster_path, "w185") || ""} alt={show.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-700 text-[8px]">N/A</div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 mt-1">
              {show.first_air_date?.slice(0, 4) && <span>{show.first_air_date.slice(0, 4)}</span>}
              {currentEp?.runtime && <span>{currentEp.runtime} min</span>}
              {currentEp?.air_date && <span>{currentEp.air_date}</span>}
              <span className="text-zinc-600">{show.number_of_seasons} Seasons</span>
            </div>
            {currentEp?.overview && (
              <p className="text-sm text-zinc-400 leading-relaxed mt-2 max-w-3xl">{currentEp.overview}</p>
            )}
          </div>
        </div>

        {/* Episode List */}
        {seasonData?.episodes && (
          <section className="mt-8">
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-zinc-500 mb-3">
              Season {seasonNum} Episodes
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {seasonData.episodes.map((ep: any) => (
                <a
                  key={ep.id}
                  href={`/watch/tv/${id}?season=${seasonNum}&episode=${ep.episode_number}`}
                  className={`p-2 rounded border transition ${
                    ep.episode_number === episodeNum
                      ? "border-yellow-500 bg-yellow-500/10"
                      : "border-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <div className="aspect-video bg-zinc-800 rounded overflow-hidden mb-1">
                    {ep.still_path ? (
                      <img src={tmdbImage(ep.still_path, "w300") || ""} alt={ep.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700 text-[10px]">{ep.episode_number}</div>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-400 truncate">{ep.episode_number}. {ep.name}</p>
                </a>
              ))}
            </div>
          </section>
        )}

        <footer className="border-t border-zinc-800 px-4 py-8 text-center text-[10px] text-zinc-700 tracking-[0.3em] uppercase mt-8">
          RabDotFi · Powered by TMDB
        </footer>
      </div>
    </div>
  );
}
