"use client"
import { useEffect } from "react";
import Style from "./SelectBtn.module.css"
import { useSelectBtnContext } from "@/app/(context)/SelectBtnContext";

interface selectBtnProps {
  btnName:string[]
}

/* Data type 
const btnName = ["Alumni Review","Google Review","Video Review"];
*/

export default function SelectorBtn({btnName}:selectBtnProps) {
  const {activeBtn,setActive} = useSelectBtnContext();

  useEffect(()=>{
    setActive(btnName[1]);
  },[])

  const selectBtnHandler = (btn:string) => {
    setActive(btn);
  }

  return (
    <>
      <div className="p-1 flex w-fit m-auto" style={{backgroundColor:"rgb(47, 47, 47)",borderRadius: "21.46px"}}>
        {btnName.map((item,index)=>
          <div key={index} className={activeBtn===item?Style.isActive:Style.nonActive}>
            <p className="pr-3 pl-3" style={{ cursor:"pointer"}} onClick={()=>{selectBtnHandler(item)}}>{item}</p>
          </div>
        )}
      </div>
    </>
  );
}

/* 
import { useState } from "react";

const ButtonSelector = () => {
  const [activeButton, setActiveButton] = useState(null); // State to track active button
  const buttons = [1, 2, 3, 4]; // Dynamic list of buttons

  return (
    <div>
      {buttons.map((button) => (
        <button
          key={button}
          className={activeButton === button ? "is-active" : ""}
          onClick={() => setActiveButton(button)}
        >
          Button {button}
        </button>
      ))}
    </div>
  );
};

export default ButtonSelector
 */