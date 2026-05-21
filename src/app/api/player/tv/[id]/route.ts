import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const s = searchParams.get("s") || "1";
  const e = searchParams.get("e") || "1";
  try {
    const res = await fetch(`https://vidsrc.cc/embed/tv/${id}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
    });
    let html = await res.text();
    if (html.includes("Opps! 404") || html.includes("<title>Not Found</title>")) {
      html = `<!DOCTYPE html><html><head><style>body{margin:0;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;text-align:center}</style></head><body><div><p style="font-size:2rem;color:yellow;margin:0">⚠</p><p style="color:#888">This title is temporarily unavailable on the current source.</p><p style="color:#555;font-size:0.8rem">Try refreshing or choose another title.</p></div></body></html>`;
    } else {
      html = html.replace(/src="\/\//g, 'src="https://');
      html = html.replace(/href="\/\//g, 'href="https://');
      html = html.replace('<head>', '<head><base href="https://vidsrc.cc/">');
    }
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8", "Access-Control-Allow-Origin": "*" },
    });
  } catch {
    return new NextResponse("<html><body>Player unavailable</body></html>", {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}
