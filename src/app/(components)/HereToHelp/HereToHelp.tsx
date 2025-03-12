import styles from "./HereToHelp.module.css";
import Link from "next/link";

type Props = {
    title: string;
    buttonText: string;
    linkTo: string;
};

interface HereToHelpProps {
    data: Props;
}

export default function HereToHelp({ data }: HereToHelpProps) {
    const { title, buttonText, linkTo } = data;

    return (
        <div className={styles.hereToHelp}>
        <div className={styles.infoSide}>
            <h3>{title}</h3>
            <Link href={`/${linkTo}`} className={styles.helpLink}>
            {buttonText}
            </Link>
        </div>
        </div>
    );
}