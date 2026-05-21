"use client";

import { useEffect, useRef } from "react";

export default function PopupBlocker() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const origOpen = window.open;
    const blocked: number[] = [];

    (window as any).__open = origOpen;

    window.open = function (...args: any[]) {
      const url = args[0] || "";
      if (typeof url === "string" && !url.includes("rabtifi") && !url.includes("vsembed") && !url.startsWith("blob:")) {
        blocked.push(Date.now());
        return null as any;
      }
      return origOpen.apply(window, args as any);
    };

    const preventRedirect = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", preventRedirect);

    let killInterval: ReturnType<typeof setInterval> | null = null;

    const checkInterval = setInterval(() => {
      if (document.hidden) {
        try { window.focus(); } catch {}
      }
    }, 1000);

    const observer = new MutationObserver(() => {
      const anchors = document.querySelectorAll<HTMLAnchorElement>("a[target='_blank']");
      anchors.forEach((a) => {
        if (a.href && !a.href.includes("rabtifi") && !a.href.includes("vsembed")) {
          a.removeAttribute("target");
          a.addEventListener("click", (e) => e.preventDefault());
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.open = origOpen;
      window.removeEventListener("beforeunload", preventRedirect);
      clearInterval(checkInterval);
      if (killInterval) clearInterval(killInterval);
      observer.disconnect();
    };
  }, []);

  return null;
}
