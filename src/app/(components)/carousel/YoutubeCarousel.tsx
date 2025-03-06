import Script from "next/script";

export default function YoutubeCarousel() {

  return (
    <>
      <div className="w-[80%] h-[350px] overflow-y-scroll m-auto">
        <div className="tagembed-widget" style={{width:"100%",height:"100%",margin:"auto"}} data-widget-id="2157471" data-tags="false"  view-url="https://widget.tagembed.com/2157471"></div>
      </div>
      <Script src="https://widget.tagembed.com/embed.min.js" type="text/javascript"/>
    </>
  );
}
