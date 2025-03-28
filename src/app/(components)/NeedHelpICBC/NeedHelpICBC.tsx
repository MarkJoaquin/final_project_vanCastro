"use client";

import { useEffect, useRef, useState } from "react";
import { StaticImageData } from "next/image";
import CardTemplate1 from "../Card/CardTemplate1";
import styles from "./NeedHelpICBC.module.css";

interface NeedHelpICBCtype {
  title1: string;
  title2: string;
  subTitle: string;
  cardInfo: {
    phoneIcon: StaticImageData;
    phoneNumber: string;
    email: string;
    socialMediaIcon: StaticImageData[];
    socialMediaLink: string[];
  };
}

interface NeedHelpICBCtypeProps {
  data: NeedHelpICBCtype;
}

export default function NeedHelpICBC({ data }: NeedHelpICBCtypeProps) {
  const { title1, title2, subTitle, cardInfo } = data;

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true); 
        }
      },
      { threshold: 0.2 } 
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`pt-[2rem] pb-[2rem] bg-[#F7f7F7] ${styles.needHelpSection}`}
    >
      <div
        className={`text-[44px] ${styles.titleFont} ${styles.slideUp} ${
          isVisible ? styles.active : ""
        }`}
      >
        <h2 className="text-center font-bold leading-10">{title1}</h2>
        <h2 className="text-center font-bold">{title2}</h2>
      </div>
      <div
        className={`text-[27px] text-center mt-4 mb-10 ${styles.subTitleFont} ${styles.slideUp} ${
          isVisible ? styles.active : ""
        }`}
      >
        <p>{subTitle}</p>
      </div>
      <div className={`${styles.slideUp} ${isVisible ? styles.active : ""}`}>
        <CardTemplate1 cardInfo={cardInfo} />
      </div>
    </section>
  );
}