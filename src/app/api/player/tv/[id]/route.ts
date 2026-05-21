import { NextRequest, NextResponse } from "next/server";

const POPUP_BLOCKER = `
<script>
(function() {
  window.open = function() { return null; };
  if (typeof document !== 'undefined') {
    new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        m.addedNodes.forEach(function(node) {
          if (node.tagName === 'IFRAME' && node.src && node.src.includes('cloudnestra.com/rcp/')) {
            node.src = '/api/player/cnx/?h=' + encodeURIComponent(node.src.split('/rcp/')[1]);
          }
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }
})();
</script>
`;

function stripAds(html: string): string {
  let clean = html;
  clean = clean.replace(/<script[^>]*src=["'][^"']*cloudnestra\.com\/asdf\.js[^"']*["'][^>]*>[\s\S]*?<\/script>/gi, "");
  clean = clean.replace(/<script[^>]*data-cf-beacon[^>]*>[\s\S]*?<\/script>/gi, "");
  clean = clean.replace(/<script[^>]*src=["'][^"']*cloudflareinsights\.com[^"']*["'][^>]*>[\s\S]*?<\/script>/gi, "");
  clean = clean.replace(/<div[^>]*id="histats_counter"[^>]*>.*?<\/div>/gi, "");
  clean = clean.replace(/<!-- Histats\.com[\s\S]*?Histats\.com  END  -->/gi, "");
  clean = clean.replace(/<script[^>]*src=["'][^"']*disable-devtool[^"']*["'][^>]*>[\s\S]*?<\/script>/gi, "");
  clean = clean.replace(/DisableDevtool\(\{[^}]+\}\);/gi, "");
  return clean;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const s = searchParams.get("s") || "1";
  const e = searchParams.get("e") || "1";
  try {
    const res = await fetch(`https://vsembed.ru/embed/tv/${id}/${s}-${e}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
    });
    let html = await res.text();
    html = stripAds(html);
    html = html.replace(/\/\/cloudnestra\.com\/rcp\//g, '/api/player/cnx/?h=');
    html = html.replace(/src="\/\//g, 'src="https://');
    html = html.replace(/href="\/\//g, 'href="https://');
    html = html.replace('<head>', '<head><base href="https://vsembed.ru/">');
    html = html.replace("</head>", POPUP_BLOCKER + "</head>");
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "X-Frame-Options": "SAMEORIGIN",
      },
    });
  } catch {
    return new NextResponse("<html><body>Player unavailable</body></html>", {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}
