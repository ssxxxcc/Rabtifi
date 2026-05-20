import { tmdbImage } from "@/lib/tmdb";

export default function TVCard({ show }: { show: any }) {
  const img = tmdbImage(show.poster_path, "w342");
  const rating = show.vote_average?.toFixed(1);

  return (
    <a href={`/tv/${show.id}`} className="flex-shrink-0 w-40 md:w-44 group">
      <div className="aspect-[2/3] bg-zinc-800 rounded-lg overflow-hidden relative">
        {img ? (
          <img src={img} alt={show.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs p-2 text-center">{show.name}</div>
        )}
        <div className="absolute top-2 left-2 bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
          {rating}
        </div>
      </div>
      <p className="text-sm text-zinc-300 mt-2 truncate group-hover:text-yellow-500 transition">{show.name}</p>
      <p className="text-[10px] text-zinc-600">
        {show.first_air_date?.slice(0, 4) || "—"}
      </p>
    </a>
  );
}
