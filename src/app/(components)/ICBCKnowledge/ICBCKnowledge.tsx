import Image, { StaticImageData } from "next/image";
import styles from "./ICBCKnowledge.module.css";
import Link from "next/link";

type Props = {
    title1: string[];
    title2: string[];
    subtitle: string[];
    title1Color: string[];
    title2Color: string[];
    subtitleColor: string[];
    img1:StaticImageData;
    img2:StaticImageData;
    buttonText: string;
    linkTo: string;
    bgColor?: string;
    btnColor: string;
    btnTextColor: string;
    type: string;
};

interface ICBCKnowledgeProps {
    data: Props;
}

export default function ICBCKnowledge({ data }: ICBCKnowledgeProps) {
    const { title1, title2, subtitle, title1Color, title2Color, subtitleColor, img1, img2, buttonText, linkTo, bgColor, btnTextColor, btnColor } = data;

    const textComponent = () => {
        return <>
        <div className="flex flex-col justify-center gap-3 items-center" style={{gridArea:"text"}}>
          <p className={`${styles.subtitleFontsize}`}>
              {subtitle.map((item,index)=>
                  <span key={index} style={{color:`${subtitleColor[index]}`}}>{item}</span>
              )}
          </p>
          <h3 className={`text-[32px] text-center ${styles.titleFontSize}`} >
              {title1.map((item,index)=>
                  <span key={index} style={{color:`${title1Color[index]}`}}>{item} </span>
              )}
              <br/>
              {title2.map((item,index)=>
                  <span key={index} style={{color:`${title2Color[index]}`}}>{item}</span>
              )}
          </h3>
        </div>
        <Link href={`/${linkTo}`} className={`w-[290px] h-[47px] rounded-md text-[20px] font-bold flex items-center justify-center m-auto ${styles.btnSize}`} style={{color:`${btnTextColor}`,backgroundColor:`${btnColor}`, gridArea:"btn"}}>
            {buttonText}
        </Link>
    </>
    }

    return (
        <section  style={{backgroundColor:`${bgColor}`}}>
            <div className={`grid w-[100%] gap-1 m-auto pt-[2rem] pb-[2rem] ${styles.gridTemplate}`}>
              <Image
                src={img1}
                alt={"img1"}
                height={165}
                width={320}
                style={{width:"165px", height:"320px",  justifySelf:"end", gridArea:"img1"}}
              />

              {textComponent()}     

              <Image
                src={img2}
                alt={"img1"}
                width={165}
                height={320}
                style={{width:"165px", height:"320px", gridArea:"img2"}}
              />
            </div>
        </section>
    );
}