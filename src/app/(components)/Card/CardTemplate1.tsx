import { StaticImageData } from "next/image";

interface CardInfoType{
  phoneIcon:StaticImageData;
  phoneNumber:string;
  email:string;
  socialMediaIcon:StaticImageData[];
}

interface CardInfoProps{
  cardInfo:CardInfoType;
}

export default function CardTemplate1({cardInfo}:CardInfoProps){
  const {} = cardInfo

  return <div>
    <div>
      <h3>Phone</h3>
    </div>
    <div>
      <h3>Email</h3>

    </div>
    <div>
      <h3>Social media</h3>

    </div>
  </div>
}