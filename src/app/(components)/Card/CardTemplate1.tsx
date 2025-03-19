import Image, { StaticImageData } from "next/image";

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

  return <div className="w-[586px] h-[355px] rounded-xl shadow-lg inset-shadow-2xs p-[46px] m-auto">
    <div>
      <h3 className="text-[20px] font-bold">Phone</h3>
      <div className="flex mt-2">
        <Image
          src={phoneIcon}
          alt="phoneIcon"
          width={23}
          height={23}
        />
        <p className="text-[20px]">{phoneNumber}</p>
      </div>
    </div>
    <div>
      <h3 className="text-[20px] font-bold mt-2">Email</h3>
      <p className="text-[20px]">{email}</p>
    </div>
    <div className="mt-4">
      <h3 className="text-[20px] font-bold">Social media</h3>
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