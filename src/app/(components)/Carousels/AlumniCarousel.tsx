"use client";
import Script from "next/script";

export default function AlumniCarousel() {
  return (
    <>
      <Script
        src="https://widget.senja.io/widget/0cd986fe-175a-4aeb-afc7-3926b243c72d/platform.js"
        strategy="afterInteractive" // IMPORTANT: ensures proper loading timing
      />
      <div
        className="senja-embed"
        data-id="0cd986fe-175a-4aeb-afc7-3926b243c72d"
        data-mode="shadow"
        data-lazyload="false"
        style={{ width: "100%", height: "auto" }}
      ></div>
    </>
  );
}
