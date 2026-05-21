import { NextRequest, NextResponse } from "next/server";

function stripAds(html: string): string {
  return html.replace(
    /<script[^>]*src=["'][^"']*(?:cloudnestra|histats|llvpn|oxidesearching|cloudflareinsights)[^"']*["'][^>]*>[\s\S]*?<\/script>/gi,
    ""
  ).replace(
    /<noscript[\s\S]*?<\/noscript>/gi, ""
  ).replace(
    /<script[^>]*data-cf-beacon[^>]*>[\s\S]*?<\/script>/gi, ""
  );
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const s = searchParams.get("s") || "1";
  const e = searchParams.get("e") || "1";
  try {
    const res = await fetch(`https://vsembed.ru/embed/tv/${id}/${s}-${e}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const html = await res.text();
    const clean = stripAds(html);
    return new NextResponse(clean, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new NextResponse("<html><body>Player unavailable</body></html>", {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}
