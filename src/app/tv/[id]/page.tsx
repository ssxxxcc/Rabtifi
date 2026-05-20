import { getTVShow, getTVSeason, tmdbImage, tmdbBackdrop } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ season?: string }>;
}

export default async function TVPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const show = await getTVShow(parseInt(id));

  const img = tmdbImage(show.poster_path, "w500");
  const backdrop = tmdbBackdrop(show.backdrop_path);
  const year = show.first_air_date?.slice(0, 4) || "";
  const rating = show.vote_average?.toFixed(1);
  const selectedSeason = parseInt(sp.season || "1", 10);
  const seasonData = await getTVSeason(parseInt(id), selectedSeason).catch(() => null);
  const cast = show.credits?.cast?.slice(0, 12) || [];
  const createdBy = show.created_by || [];
  const networks = show.networks || [];

  return (
    <div>
      <div className="relative h-[50vh] min-h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-top"
          style={{ backgroundImage: `url(${backdrop})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/70 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-40 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0 w-48 md:w-64">
            <div className="aspect-[2/3] bg-zinc-800 rounded-xl overflow-hidden shadow-2xl">
              {img ? (
                <img src={img} alt={show.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-700 text-sm p-4 text-center">{show.name}</div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0 pt-4 md:pt-16">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{show.name}</h1>
            {show.tagline && <p className="text-zinc-500 italic mb-4">{show.tagline}</p>}

            <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
              {rating && (
                <span className="bg-yellow-500 text-black font-bold px-2 py-0.5 rounded text-xs">★ {rating}</span>
              )}
              {year && <span className="text-zinc-400">{year}</span>}
              {show.number_of_seasons && <span className="text-zinc-400">{show.number_of_seasons} Seasons</span>}
              {show.episode_run_time?.[0] && <span className="text-zinc-400">{show.episode_run_time[0]} min</span>}
              {show.status && <span className="text-zinc-600 uppercase tracking-wider text-[10px]">{show.status}</span>}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {show.genres?.map((g: any) => (
                <a
                  key={g.id}
                  href={`/search/tv?genre=${g.id}`}
                  className="text-xs border border-zinc-700 text-zinc-400 hover:border-yellow-500 hover:text-yellow-500 px-3 py-1 rounded-full transition"
                >
                  {g.name}
                </a>
              ))}
            </div>

            {show.overview && (
              <div className="mb-6">
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Overview</h3>
                <p className="text-zinc-400 leading-relaxed text-sm max-w-2xl">{show.overview}</p>
              </div>
            )}

            {createdBy.length > 0 && (
              <p className="text-sm text-zinc-500 mb-4">
                <span className="text-zinc-600">Created by: </span>
                {createdBy.map((c: any) => c.name).join(", ")}
              </p>
            )}

            {networks.length > 0 && (
              <p className="text-sm text-zinc-500 mb-4">
                <span className="text-zinc-600">Network: </span>
                {networks.map((n: any) => n.name).join(", ")}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <a
                href={`/watch/tv/${show.id}?season=${selectedSeason}&episode=1`}
                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg transition"
              >
                ▶ Watch Now
              </a>
            </div>
          </div>
        </div>

        {/* Seasons */}
        {show.seasons && show.seasons.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-white mb-4">Seasons</h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {show.seasons.filter((s: any) => s.season_number > 0).map((s: any) => (
                <a
                  key={s.season_number}
                  href={`/tv/${show.id}?season=${s.season_number}`}
                  className={`flex-shrink-0 w-32 group ${selectedSeason === s.season_number ? "ring-2 ring-yellow-500 rounded-lg" : ""}`}
                >
                  <div className="aspect-[2/3] bg-zinc-800 rounded-lg overflow-hidden">
                    {s.poster_path ? (
                      <img src={tmdbImage(s.poster_path, "w185") || ""} alt={s.name} className="w-full h-full object-cover group-hover:opacity-80 transition" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs p-2 text-center">{s.name}</div>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1.5 truncate group-hover:text-yellow-500 transition">{s.name}</p>
                  <p className="text-[10px] text-zinc-600">{s.episode_count} eps</p>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Episodes */}
        {seasonData?.episodes && (
          <section className="mt-8">
            <h2 className="text-lg font-bold text-white mb-4">Season {selectedSeason} Episodes</h2>
            <div className="grid gap-3">
              {seasonData.episodes.map((ep: any) => (
                <a
                  key={ep.id}
                  href={`/watch/tv/${show.id}?season=${selectedSeason}&episode=${ep.episode_number}`}
                  className="flex items-center gap-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg p-3 transition group"
                >
                  <div className="w-24 md:w-32 aspect-video bg-zinc-700 rounded overflow-hidden shrink-0">
                    {ep.still_path ? (
                      <img src={tmdbImage(ep.still_path, "w300") || ""} alt={ep.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">No image</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 font-medium group-hover:text-yellow-500 transition">
                      {ep.episode_number}. {ep.name}
                    </p>
                    {ep.overview && <p className="text-xs text-zinc-500 line-clamp-2 mt-1">{ep.overview}</p>}
                    <p className="text-[10px] text-zinc-700 mt-1">
                      {ep.runtime ? `${ep.runtime} min` : ""}
                      {ep.air_date ? ` · ${ep.air_date}` : ""}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Cast */}
        {cast.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-white mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {cast.map((c: any) => (
                <div key={c.id} className="flex-shrink-0 w-24 text-center">
                  <div className="w-24 h-24 rounded-full bg-zinc-800 overflow-hidden mx-auto mb-2">
                    {c.profile_path ? (
                      <img src={tmdbImage(c.profile_path, "w185") || ""} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700 text-[8px]">{c.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}</div>
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
        {show.recommendations?.results?.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-white mb-4">You Might Also Like</h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {show.recommendations.results.slice(0, 10).map((m: any) => (
                <MovieCard key={m.id} movie={{ ...m, title: m.name || m.title }} />
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
