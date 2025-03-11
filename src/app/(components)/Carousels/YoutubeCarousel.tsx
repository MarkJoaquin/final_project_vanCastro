import { useEffect, useState } from "react";
import YouTube, { YouTubeProps } from 'react-youtube';
import YoutubeIcon from "@/../public/YoutubeIcon_60_45.png"

import Image from "next/image";

//const data = [1,2,3,4,5,6,7,8,9,10,11,12]
const youtubeData = [
  {
    id:1,
    schoolName:"VanCastro Driving Scholl",
    nameAndLocation:"Laisa - ICBC North Vancouver - VanCastro (604) 600-9173",
    youtubeId:"3_3wr9n8wWA",
    clientIcon:"",
    youtubeIcon:YoutubeIcon,
    created:"2023/07/18"
  },
  {
    id:2,
    schoolName:"VanCastro Driving Scholl",
    nameAndLocation:"Thiago Salles - ICBC Longheed - VanCastro (604) 600-9173",
    youtubeId:"g3W_rDN3Utk",
    clientIcon:"",
    youtubeIcon:YoutubeIcon,
    created:"2023/08/03"
  },
  {
    id:3,
    schoolName:"VanCastro Driving Scholl",
    nameAndLocation:"Camila Almeida - ICBC North Vancouver - VanCastro (604) 600-9173",
    youtubeId:"NaPN2IXfQhI",
    clientIcon:"",
    youtubeIcon:YoutubeIcon,
    created:"2023/08/02"
  },
  {
    id:4,
    schoolName:"VanCastro Driving Scholl",
    nameAndLocation:"Gabriel - ICBC North Vancouver - VanCastro (604) 600-9173",
    youtubeId:"1JtzGhZiA38",
    clientIcon:"",
    youtubeIcon:YoutubeIcon,
    created:"2023/08/03"
  },
  {
    id:5,
    schoolName:"VanCastro Driving Scholl",
    nameAndLocation:"Nelson - ICBC North Vancouver - VanCastro (604) 600-9173",
    youtubeId:"U7Rj3aDuR5I",
    clientIcon:"",
    youtubeIcon:YoutubeIcon,
    created:"2023/08/02"
  },
  {
    id:6,
    schoolName:"VanCastro Driving Scholl",
    nameAndLocation:"Leandro Giometti - ICBC Lougheed - VanCastro (604) 600-9173",
    youtubeId:"Wf_D5Zr1G7E",
    clientIcon:"",
    youtubeIcon:YoutubeIcon,
    created:"2023/08/03"
  },
]

export default function YoutubeCarousel() {
	const [currentPage,setCurrentPage] = useState<number>(1);
	const [pagePerItems,setPagePerItems] = useState<number>(3);
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [count, setCount] = useState<number>(0);

  //get window size for resizing
  useEffect(()=>{
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };

  },[])

  //Resize for responsive
  useEffect(()=>{
    if(width>935 && pagePerItems!==3){
      setPagePerItems(3)
      setCurrentPage(1)
    }else if(width<934 && width>621 && pagePerItems!==2){
      setPagePerItems(2)
      setCurrentPage(1)
    }else if(width<620 && pagePerItems!==1){
      setPagePerItems(1)
      setCurrentPage(1)
    }
  },[width])

  //set timer for auto feed
  useEffect(()=>{
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    return () => clearInterval(interval);
  },[])

  //execute auto feed
  useEffect(()=>{
    if(count>=10){
      handleNext();
    }
  },[count])

  //reset timer
  useEffect(()=>{
    setCount(0);
  },[currentPage])

	const totalPage = Math.ceil(youtubeData.length/pagePerItems);
	const startIndex = (currentPage-1)*pagePerItems;
	const currentItems = youtubeData.slice(startIndex,startIndex+pagePerItems)

	const handlePrevious = ()=>{
		setCurrentPage((prev)=>{
      if(prev===1){
        return totalPage
      } else {
        return Math.max(prev-1,1)
      }
    })
	}
	const handleNext = ()=>{
		setCurrentPage((next)=>{
      if(next===totalPage){
        return 1
      } else {
        return Math.min(next+1,totalPage)
      }
    })
	}

  const onReady: YouTubeProps['onReady'] = (event) => {
    const player = event.target;
      player.playVideo();
  };
  const options: YouTubeProps['opts'] = {
    width: 'auto',  // Video width
    playerVars: {
      autoplay: 1,       // Auto-play video
      modestbranding: 1, // Remove YouTube logo
      rel: 0,            // Disable related videos at the end
    },
  };

  return (
    <>
      <div className="flex justify-center flex-wrap gap-4 relative">
        <div className="absolute left-0" onClick={handlePrevious}>left</div>
        {currentItems.map((item,index)=>
          <div key={index} className="w-[300px] h-auto flex flex-col border-1 border-gray-300 rounded-sm shadow-md"style={{
            boxShadow: "1px 1px 2px 2px rgba(200,200,200, 0.3)"
          }}>
            <div className="bg-black basis-2/3 rounded-t-sm">
              <YouTube
                videoId={item.youtubeId}
                onReady={onReady}
                opts={options}
              />
            </div>
            <div className="basis-1/3 text-center pt-4 pb-4 pl-2 pr-2">
              <h3>{item.schoolName}</h3>
              <p>{item.created}</p>
              <Image
                src={YoutubeIcon}
                alt="youtubeIcon"
                width={60}
                height={45} 
                style={{margin:"auto"}} 
                />
              <p>{item.nameAndLocation}</p>
              <p>{count}</p>
            </div>

{/*  Image of customer
            <div>
              <Image
                src={client2Img}
                alt="client2"
                width={45}
                height={45}
              />
            </div>
 */}
          </div>
        )}
        <div className="absolute right-0" onClick={handleNext}>Right</div>
      </div>
    </>
  );
}
