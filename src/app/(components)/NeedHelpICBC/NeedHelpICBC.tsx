import { StaticImageData } from "next/image";
import CardTemplate1 from "../Card/CardTemplate1";

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
        <section className="bg-[#F7f7F7]">
          <div>
            <h2>{title1}</h2>
            <h2>{title2}</h2>
          </div>
          <div>
            <p>{subTitle}</p>
          </div>
          <CardTemplate1 cardInfo={cardInfo}/>
        </section>
    );
}