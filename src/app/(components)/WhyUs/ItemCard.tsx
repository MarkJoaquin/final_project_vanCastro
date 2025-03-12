import Image from "next/image";
import styles from './ItemCard.module.css'
type Props = {
    id:number,
    title: string,
    icon: string,
    message: string
}

interface CardProps {
    card:Props
}

export default function Card({card}: CardProps){

    const {title, icon, message} = card;

    return(
        <li className={styles.cardItem}>
            <p className={styles.cardTitle}>{title}</p>
            <Image
                src={icon}
                alt={title}
                width={200}
                height={200}
            />
            <p className={styles.cardMsg}>{message}</p>
        </li>
    )
}