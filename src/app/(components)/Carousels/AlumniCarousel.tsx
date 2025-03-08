"use client"
import Script from "next/script";

export default function AlumniCarousel() {

  return (
    <>
      <div className="h-[300px] overflow-y-scroll">
        <div className="senja-embed" data-id="3399a6a4-22ca-4f9d-a078-a3b178e87828" data-mode="shadow" data-lazyload="false" style={{display:"block"}}></div>

        <Script src="https://widget.senja.io/widget/3399a6a4-22ca-4f9d-a078-a3b178e87828/platform.js" type="text/javascript" async />
      </div>
    </>
  );
}

