import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const res = await fetch(`https://vsembed.ru/embed/movie/${id}/`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
    });
    let html = await res.text();
    html = html.replace(/<script[^>]*src=["'][^"']*cloudnestra\.com[^"']*["'][^>]*>[\s\S]*?<\/script>/gi, "");
    html = html.replace(/<script[^>]*src=["'][^"']*llvpn\.com[^"']*["'][^>]*>[\s\S]*?<\/script>/gi, "");
    html = html.replace(/<script[^>]*data-cf-beacon[^>]*>[\s\S]*?<\/script>/gi, "");
    html = html.replace(/<div[^>]*id="histats_counter"[^>]*>.*?<\/div>/gi, "");
    html = html.replace(/<!-- Histats\.com[\s\S]*?Histats\.com  END  -->/gi, "");
    html = html.replace(/<script[^>]*src=["'][^"']*disable-devtool[^"']*["'][^>]*>[\s\S]*?<\/script>/gi, "");
    html = html.replace(/DisableDevtool\(\{[^}]+\}\);/gi, "");
    html = html.replace(/src="\/\//g, 'src="https://');
    html = html.replace(/href="\/\//g, 'href="https://');
    html = html.replace(/<iframe\s/g, '<iframe sandbox="allow-scripts allow-same-origin" ');
    html = html.replace('<head>', '<head><base href="https://vsembed.ru/"><script>window.open=function(){return null};var ce=document.createElement.bind(document);document.createElement=function(t){var e=ce(t);if(t&&t.toLowerCase&&t.toLowerCase()==="iframe"){e.setAttribute("sandbox","allow-scripts allow-same-origin")}return e}</script>');
    return new NextResponse(html, {
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
