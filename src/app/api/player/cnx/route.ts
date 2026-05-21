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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const h = searchParams.get("h");
  if (!h) {
    return new NextResponse("<html><body>Missing hash</body></html>", {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
  try {
    const res = await fetch(`https://cloudnestra.com/rcp/${h}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    let html = await res.text();
    html = stripAds(html);
    html = html.replace("</head>", POPUP_BLOCKER + "</head>");
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
