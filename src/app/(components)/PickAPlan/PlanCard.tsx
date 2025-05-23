import styles from './PlanCard.module.css'
import CheckIcon from '../CheckIcon/CheckIcon';
import StarIcon from '../StarIcon/StarIcon'
import Link from 'next/link';
type Props = {
    category: string;
    title: string;
    planName: string;
    price: string,
    featuresList:string[],
    planId:string,
}


interface CardProps {
    data: Props
}


export default function PlanCard({data}: CardProps) {

    const { category, title, planName, price, featuresList, planId } = data

    return(
        <div className={`${styles.cardItem} ${title === 'Package' ? styles.package : ''}`}>
            {title === 'Package' && (
                <div className={styles.mostPopularContainer}>
                <StarIcon className={styles.spinStar}/><p className={styles.mostPopularLabel}>Most Popular</p><StarIcon className={styles.spinStar}/>
                </div>
            )}
            <p className={styles.title}>{title}</p>
            <p className={styles.planName}>{planName}</p>
            <div className={styles.priceContainer}>
                <p className={styles.price}>${price}</p>
            </div>
            <div className={styles.featuresList}>
            {featuresList.map((feature,index) => (
                <div key={index} className={styles.feature}>
                    <CheckIcon/><p>{feature}</p>
                </div>
            ))}
            </div>
            <div className={styles.btnContainer}>
                <Link href={'/booking'} className={styles.bookingBtn}>Book Now</Link>
            </div>
        </div>
    )
}