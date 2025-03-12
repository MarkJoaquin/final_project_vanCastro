"use client"
import SelectorBtn from "../(components)/Button/SelectorBtn";
import { useSelectBtnContext } from "../(context)/SelectBtnContext";
import AlumniCarousel from "../(components)/Carousels/AlumniCarousel";
import GoogleCarousel from "../(components)/Carousels/GoogleCarousel";
import YoutubeCarousel from "../(components)/Carousels/YoutubeCarousel";
import Style from "./Review.module.css"

interface selectBtnProps {
  btnName:string[]
}

export default function Review({btnName}:selectBtnProps){
  const {activeBtn} = useSelectBtnContext();

  const setReview = () => {
    if(activeBtn==="Google Review"){
      return <GoogleCarousel/>
    }
    if(activeBtn==="Video Review"){
      return <YoutubeCarousel/>
    }
    //Default
    return <AlumniCarousel/>
  }
  
  return(
    <section>
      <h2 className={`text-[50px] font-[700] text-center p-[30px] ${Style.reviewTitle}`}>Check Out Real Reviews</h2>
      <div className="pb-4">
        <SelectorBtn btnName={btnName}/>
      </div>
      <div className="pt-4 pb-[30px]">
        {setReview()}
      </div>
    </section>
  )
}