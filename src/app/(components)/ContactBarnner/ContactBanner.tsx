import Image, { StaticImageData } from "next/image";
import styles from "./ContactBanner.module.css";
import Link from "next/link";

type Props = {
    title1: string[];
    title2: string[];
    subtitle: string[];
    title1Color: string[];
    title2Color: string[];
    subtitleColor: string[];
    img1:StaticImageData;
    img2?:StaticImageData;
    buttonText: string;
    linkTo: string;
    bgColor?: string;
    btnColor: string;
    btnTextColor: string;
    type: string;
};

interface HereToHelpProps {
    data: Props;
}

export default function ContactBanner({ data }: HereToHelpProps) {
    const { title1, title2, subtitle, title1Color, title2Color, subtitleColor, img1, img2, buttonText, linkTo, bgColor, btnTextColor, type, btnColor } = data;

    const textComponent = () => {
        let titleLayout = null;
        let ordertytle = 'order-1';
        let ordersubtitle = 'order-2';
        let orderbtn = 'order-3';
        if(type === "style2"){
            titleLayout = "text-center"
            ordertytle = 'order-2'
            ordersubtitle = 'order-1'
        }
        return <>
        <h3 className={`text-[32px] ${titleLayout} ${ordertytle} ${styles.titleFontSize}`} >
            {title1.map((item,index)=>
                <span key={index} style={{color:`${title1Color[index]}`,order:`${ordertytle}`}}>{item} </span>
            )}
            <br/>
            {title2.map((item,index)=>
                <span key={index} style={{color:`${title2Color[index]}`}}>{item}</span>
            )}
        </h3>
        <p className={`${ordersubtitle}`}>
            {subtitle.map((item,index)=>
                <span key={index} style={{color:`${subtitleColor[index]}`}}>{item}</span>
            )}
        </p>
        <Link href={`/${linkTo}`} className={`w-[290px] h-[47px] rounded-md text-[20px] font-bold flex items-center justify-center ${orderbtn}`} style={{color:`${btnTextColor}`,backgroundColor:`${btnColor}`}}>
            {buttonText}
        </Link>
    </>
    }

    return (
        <section  style={{backgroundColor:`${bgColor}`}}>
            <div className={`grid w-[100%] justify-around gap-3 m-auto pt-[2rem] pb-[2rem] ${img2?styles.gridTemplateStyle2:styles.gridTemplateStyle1}`}>
                {img2?
                    <>
                        <Image
                            className={`${styles.style2img1}`}
                            src={img1}
                            alt={"img1"}
                            height={320}
                            width={320}
                            style={{width:"165px", height:"320px", flexBasis:"1fr", gridArea:"style2img1"}}
                        />
                        <div className="basis-3/5 flex flex-col gap-3 justify-center items-center" style={{ gridArea:"style2text"}}>
                            {textComponent()}     
                        </div>
                        <Image
                            src={img2}
                            alt={"img1"}
                            width={165}
                            height={320}
                            style={{width:"165px", height:"320px", flexBasis:"1fr", gridArea:"style2img2"}}
                        />
                    </>
                    :<>
                        <Image
                            className={`${styles.style1img1}`}
                            src={img1}
                            alt={"img1"}
                            height={350}
                            width={400}
                            style={{width:"250px", height:"300px", flexBasis:"1fr", gridArea:"img1"}}
                        />
                        <div className="basis-2/3 flex flex-col gap-[2rem] justify-center" style={{ gridArea:"text"}}>
                            {textComponent()}     
                        </div>
                    </>
                }
            </div>
        </section>
    );
}