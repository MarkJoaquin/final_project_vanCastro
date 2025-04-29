"use client"
import SelectorBtn from "../Button/SelectorBtn";
import AlumniCarousel from "../Carousels/AlumniCarousel";
import GoogleCarousel from "../Carousels/GoogleCarousel";
import YoutubeCarousel from "../Carousels/YoutubeCarousel";
import Style from "./Review.module.css"
import { useState } from "react";

interface selectBtnProps {
  btnName:string[]
}

export default function Review({btnName}:selectBtnProps){
  const [selectedSection, setSelectedSection] = useState(btnName[1]);

  const setReview = () => {
    if(selectedSection==="Alumni Review"){
      return <AlumniCarousel/>
    }
    if(selectedSection==="Video Review"){
      return <YoutubeCarousel/>
    }
    //Default
    return <GoogleCarousel/>
  }
  
  return(
    <section className="mt-[60px]">
      <h2 className={`text-[50px] font-[700] text-center p-[30px] ${Style.reviewTitle}`}>Check Out Real Reviews</h2>
      <div className="pb-4">
        <SelectorBtn btnName={btnName} onSelect={setSelectedSection} calousel={true}/>
      </div>
      <div className="pt-4 pb-[30px]">
        {setReview()}
      </div>
    </section>
  )
}