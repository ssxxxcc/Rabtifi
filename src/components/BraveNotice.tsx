"use client";

import { useState, useEffect } from "react";

export default function BraveNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("rabdotfi-notice-dismissed");
    if (!dismissed) setShow(true);
  }, []);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem("rabdotfi-notice-dismissed", "1");
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-lg w-full p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-yellow-500 mb-3">
          HEY! Please Read This Noti
        </h2>
        <div className="text-sm text-zinc-300 leading-relaxed space-y-3">
          <p>
            You rabbit tunneling coding buddy made improvements before you continue watching movies make sure you download{" "}
            <a
              href="https://brave.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-500 underline hover:text-yellow-400"
            >
              Brave browser
            </a>
            , it comes with a powerful adblocker.
          </p>
          <p>
            Why download Brave? Because our movie video providers have sum no no friendly content that can be opened on your browser. How do you stop it? Well by downloading Brave ofc.
          </p>
          <p>
            Trust in your privacy, enjoy. Any reports needed make sure to DM me on Discord or call me if you have my number!!
          </p>
        </div>
        <button
          onClick={dismiss}
          className="mt-5 w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2.5 rounded-lg transition"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
