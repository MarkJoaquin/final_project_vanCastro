"use client"
import Script from "next/script";

export default function GoogleCarousel() {

  return (
    <>
      <div className="senja-embed" data-id="f7b0745b-52d7-4f81-985f-6fc6b3fd18d8" data-mode="shadow" data-lazyload="true" style={{display: "block", padding: "0px 20px"}}></div>
      <Script src="https://widget.senja.io/widget/f7b0745b-52d7-4f81-985f-6fc6b3fd18d8/platform.js" type="text/javascript" async/>
    </>
  );
}

