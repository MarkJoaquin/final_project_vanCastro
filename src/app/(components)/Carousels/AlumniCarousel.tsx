"use client"
import Script from "next/script";

export default function AlumniCarousel() {

  return (
    <>
      <div className="pr-[20px] pl-[20px] h-[auto]">
        <div className="senja-embed" data-id="3399a6a4-22ca-4f9d-a078-a3b178e87828" data-mode="shadow" data-lazyload="true" style={{display:"block", minHeight:"fit-content"}}></div>

        <Script src="https://widget.senja.io/widget/3399a6a4-22ca-4f9d-a078-a3b178e87828/platform.js" type="text/javascript" async />
      </div>
    </>
  );
}

