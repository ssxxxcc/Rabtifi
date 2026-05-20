const BASE = "https://api.themoviedb.org/3";
const TOKEN = process.env.TMDB_ACCESS_TOKEN!;

async function tmdb<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${TOKEN}` },
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${await res.text().catch(() => "")}`);
  return res.json();
}

export const tmdbImage = (path: string | null, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export const tmdbBackdrop = (path: string | null) =>
  path ? `https://image.tmdb.org/t/p/original${path}` : null;

// --- Movies ---
export function getPopularMovies(page = 1) {
  return tmdb<any>("/movie/popular", { page: String(page) });
}

export function getNowPlaying(page = 1) {
  return tmdb<any>("/movie/now_playing", { page: String(page) });
}

export function getTopRatedMovies(page = 1) {
  return tmdb<any>("/movie/top_rated", { page: String(page) });
}

export function getUpcomingMovies(page = 1) {
  return tmdb<any>("/movie/upcoming", { page: String(page) });
}

export function getTrendingMovies(timeWindow: "day" | "week" = "week") {
  return tmdb<any>(`/trending/movie/${timeWindow}`);
}

export function getMovie(id: number) {
  return tmdb<any>(`/movie/${id}`, {
    append_to_response: "videos,credits,recommendations,similar",
  });
}

export function searchMovies(query: string, page = 1) {
  return tmdb<any>("/search/movie", { query, page: String(page) });
}

// --- TV Shows ---
export function getPopularTV(page = 1) {
  return tmdb<any>("/tv/popular", { page: String(page) });
}

export function getTopRatedTV(page = 1) {
  return tmdb<any>("/tv/top_rated", { page: String(page) });
}

export function getAiringToday(page = 1) {
  return tmdb<any>("/tv/airing_today", { page: String(page) });
}

export function getOnTheAir(page = 1) {
  return tmdb<any>("/tv/on_the_air", { page: String(page) });
}

export function getTrendingTV(timeWindow: "day" | "week" = "week") {
  return tmdb<any>(`/trending/tv/${timeWindow}`);
}

export function getTVShow(id: number) {
  return tmdb<any>(`/tv/${id}`, {
    append_to_response: "videos,credits,recommendations,similar,external_ids,content_ratings",
  });
}

export function searchTV(query: string, page = 1) {
  return tmdb<any>("/search/tv", { query, page: String(page) });
}

export function getTVSeason(id: number, season: number) {
  return tmdb<any>(`/tv/${id}/season/${season}`);
}

// --- Shared ---
export function getGenres(type: "movie" | "tv" = "movie") {
  return tmdb<{ genres: any[] }>(`/genre/${type}/list`);
}

export function discoverByGenre(genreId: number, type: "movie" | "tv" = "movie", page = 1) {
  return tmdb<any>(`/discover/${type}`, {
    with_genres: String(genreId),
    page: String(page),
    sort_by: "popularity.desc",
  });
}

export function getTrending(type: "movie" | "tv" = "movie", timeWindow: "day" | "week" = "week") {
  return tmdb<any>(`/trending/${type}/${timeWindow}`);
}
