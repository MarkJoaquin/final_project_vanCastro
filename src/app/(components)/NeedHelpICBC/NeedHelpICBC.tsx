import { StaticImageData } from "next/image";
import CardTemplate1 from "../Card/CardTemplate1";
import styles from "./NeedHelpICBC.module.css"

interface NeedHelpICBCtype {
  title1:string;
  title2:string;
  subTitle:string;
  cardInfo:{
    phoneIcon:StaticImageData;
    phoneNumber:string;
    email:string;
    socialMediaIcon:StaticImageData[];
    socialMediaLink:string[];
  }
}

interface NeedHelpICBCtypeProps {
  data:NeedHelpICBCtype
}

export default function NeedHelpICBC({data}:NeedHelpICBCtypeProps) {
    const { title1, title2, subTitle, cardInfo } = data;


    return (
        <section  className="pt-[2rem] pb-[2rem] bg-[#F7f7F7]">
          <div className={`text-[44px] ${styles.titleFont}`}>
            <h2 className="text-center font-bold leading-10">{title1}</h2>
            <h2 className="text-center font-bold">{title2}</h2>
          </div>
          <div>
            <p className={`text-[27px] text-center mt-4 mb-10 ${styles.subTitleFont}`}>{subTitle}</p>
          </div>
          <CardTemplate1 cardInfo={cardInfo}/>
        </section>
    );
}