import styles from "./HereToHelp.module.css";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";

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

export default function HereToHelp({ data }: HereToHelpProps) {
    const { title1, title2, subtitle, buttonText, linkTo } = data;

    return (
        <div className={styles.hereToHelp}>
            <div className={styles.imageSide}>
                <Image src="./images/HereToHelp/here-to-help-icon.svg" alt="Here to Help" width={200} height={200} />
                <Link href={`/${linkTo}`} className={styles.buttonMobile}>
                {buttonText}
                </Link>
            </div>
            <div className={styles.infoSide}>
                <h3 className={styles.changingTitle}>{title1}</h3>
                <h3>{title2}</h3>
                <p>{subtitle}</p>
                <Link href={`/${linkTo}`} className={styles.button}>
                {buttonText}
                </Link>
            </div>
        </div>
    );
}