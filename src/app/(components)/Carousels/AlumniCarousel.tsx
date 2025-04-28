"use client";
import Script from "next/script";

export default function AlumniCarousel() {
  return (
    <>
      <Script
        src="https://widget.senja.io/widget/a537765a-2cf2-450c-8e6b-cd60b4139d1d/platform.js"
        strategy="afterInteractive" // IMPORTANT: ensures proper loading timing
      />
      <div
        className="senja-embed"
        data-id="a537765a-2cf2-450c-8e6b-cd60b4139d1d"
        data-mode="shadow"
        data-lazyload="false"
        style={{ width: "100%", height: "auto" }}
      ></div>
    </>
  );

}
