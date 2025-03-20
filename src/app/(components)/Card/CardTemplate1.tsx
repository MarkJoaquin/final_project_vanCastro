import Image, { StaticImageData } from "next/image";
import styles from "./CardTemplate.module.css"

interface CardInfoType{
  phoneIcon:StaticImageData;
  phoneNumber:string;
  email:string;
  socialMediaIcon:StaticImageData[];
  socialMediaLink:string[];
}

interface CardInfoProps{
  cardInfo:CardInfoType;
}

export default function CardTemplate1({cardInfo}:CardInfoProps){
  const { phoneIcon, phoneNumber, email, socialMediaIcon, socialMediaLink} = cardInfo

  const iconHandler = (link:string) => {
    console.log("clicked",link)
  }

  return <div className={`w-[586px] h-[355px] rounded-xl bg-white shadow-lg inset-shadow-2xs p-[46px] m-auto ${styles.cardComponent}`}>
    <div>
      <h3 className={`text-[20px] font-bold ${styles.fontSizeS}`}>Phone</h3>
      <div className="flex mt-2">
        <Image
          src={phoneIcon}
          alt="phoneIcon"
          width={23}
          height={23}
        />
        <p className={`text-[20px] ${styles.fontSizeS}`}>{phoneNumber}</p>
      </div>
    </div>
    <div>
      <h3 className={`text-[20px] font-bold mt-4 ${styles.fontSizeS}`}>Email</h3>
      <p className={`text-[20px] mt-2 ${styles.fontSizeS}`}>{email}</p>
    </div>
    <div className="mt-8">
      <h3 className={`text-[20px] font-bold ${styles.fontSizeS}`}>Social media</h3>
      <div className="flex gap-4 mt-2">
        {socialMediaIcon.map((item,index)=>{
          return <Image
                    key={index}
                    src={item}
                    alt="icon"
                    width={50}
                    height={50}
                  />
        }      
        )}
      </div>
    </div>
  </div>
}