import { StaticImageData } from "next/image";
import styles from "./HereToHelp.module.css";
import Link from "next/link";

type Props = {
    title: string;
    subtitle: string;
    buttonText: string;
    linkTo: string;
    personImg1:StaticImageData;
    personImg2:StaticImageData;
};

interface ICBCKnowledgeProps {
    data: Props;
}

export default function ICBCKnowledgeTest({ data }: ICBCKnowledgeProps) {
    const { title, subtitle, buttonText, linkTo, personImg1, personImg2 } = data;

    return (
        <div className={``}>
        </div>
    );
}