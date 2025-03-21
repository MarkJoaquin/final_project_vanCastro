import { ImWhatsapp } from "react-icons/im";
import Image from "next/image";
import styles from './CoachCard.module.css'
import { DrivingInstructor } from '@/types/contentful';

interface CoachCard {
    data: Partial<DrivingInstructor>
}

export default function CoachCard({data}:CoachCard){

    const {avatar3, name, phone, description} = data;
    // console.log('Avatar: ', avatar3.fields?.file.url)

    return(
        <div className={styles.cardContainer}>
            <div className={styles.imageContainer}>
                {/* <img src={image} alt={name} /> */}
                <Image
                src = {(('https:' + avatar3?.fields.file.url) as string) || '' }
                alt = {(name as string) || ''}
                width={300}
                height={0}
                />
            </div>
            <div className={styles.content}>
                <h3 className={styles.name}>{name}</h3>
                <div className={styles.phoneContainer}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-color)]">
                        <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#2f2f2f]">
                        <ImWhatsapp className="h-4 w-4 text-[var(--primary-color)]" />
                        </div>
                    </div>

                    <p className={styles.phone}>{phone}</p>
                </div>
                <p className={styles.description}>{description}</p>
            </div>
        </div>
    )
}