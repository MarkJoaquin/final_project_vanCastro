import styles from "./HereToHelp.module.css";
import Link from "next/link";

type Props = {
    title1: string;
    title2: string;
    subtitle: string;
    buttonText: string;
    linkTo: string;
};

interface HereToHelpProps {
    data: Props;
}

export default function HereToHelp({ data }: HereToHelpProps) {
    const { title1, title2, subtitle, buttonText, linkTo } = data;

    return (
        <div className={styles.hereToHelp}>
            <div className={styles.imageSide}>
                <img src="./images/HereToHelp/here-to-help-icon.svg" alt="Here to Help" />
            </div>
            <div className={styles.infoSide}>
                <h3 className={styles.title}>{title1}</h3>
                <h3>{title2}</h3>
                <p>{subtitle}</p>
                <Link href={`/${linkTo}`} className={styles.button}>
                {buttonText}
                </Link>
            </div>
        </div>
    );
}