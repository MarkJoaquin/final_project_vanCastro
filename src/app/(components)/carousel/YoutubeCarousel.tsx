import Script from "next/script";

export default function YoutubeCarousel() {

  return (
    <>
      <div className="tagembed-widget" style={{width:"80%",height:"100%",margin:"auto"}} data-widget-id="2157471" data-tags="false"  view-url="https://widget.tagembed.com/2157471"></div>
      <Script src="https://widget.tagembed.com/embed.min.js" type="text/javascript"/>
    </>
  );
}

/* 
<div class="tagembed-widget" style="width:80%;height:100%" data-widget-id="2157471" data-tags="false"  view-url="https://widget.tagembed.com/2157471"></div><script src="https://widget.tagembed.com/embed.min.js" type="text/javascript"></script>
*/