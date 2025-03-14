"use client"
import { useState } from "react";
import Style from "./SelectBtn.module.css"

interface selectBtnProps {
  btnName:string[];
  onSelect: (btn:string) => void;
}

export default function SelectorBtn({btnName, onSelect}:selectBtnProps) {
  const [activeBtn,setActiveBtn] = useState<string>(btnName[0])

  const selectBtnHandler = (btn:string) => {
    setActiveBtn(btn);
    onSelect(btn);
  }

  return (
    <>
      <div className="p-1 flex w-fit m-auto text-center" style={{backgroundColor:"rgb(47, 47, 47)",borderRadius: "21.46px", padding:"0.4rem", margin:"0 auto"}}>
        {btnName.map((item,index)=>
          <div key={index} className={activeBtn===item?Style.isActive:Style.nonActive}>
            <p className="pr-3 pl-3" style={{ cursor:"pointer"}} onClick={()=>{selectBtnHandler(item)}}>{item}</p>
          </div>
        )}
      </div>
    </>
  );
}