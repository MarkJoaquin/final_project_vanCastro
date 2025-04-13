"use client";
import { useState } from "react";
import Style from "./SelectBtn.module.css";

interface selectBtnProps {
  btnName: string[];
  onSelect: (btn: string) => void;
}

export default function SelectorBtn({ btnName, onSelect }: selectBtnProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const selectBtnHandler = (index: number, btn: string) => {
    setActiveIndex(index);
    onSelect(btn);
  };

  return (
    <div
      className={Style.container}
      style={{ "--btn-count": btnName.length } as React.CSSProperties}
    >
      <div
        className={Style.slider}
        style={{
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      ></div>
      {btnName.map((item, index) => (
        <div
          key={index}
          className={`${Style.button} ${
            activeIndex === index ? Style.isActive : ""
          }`}
          onClick={() => selectBtnHandler(index, item)}
        >
          {item}
        </div>
      ))}
    </div>
  );
}