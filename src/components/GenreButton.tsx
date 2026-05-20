export default function GenreButton({ genre }: { genre: { id: number; name: string } }) {
  return (
    <a
      href={`/search?genre=${genre.id}`}
      className="text-xs border border-zinc-700 text-zinc-400 hover:border-yellow-500 hover:text-yellow-500 px-3 py-1.5 rounded-full transition"
    >
      {genre.name}
    </a>
  );
}
