import styles from './ItemCard.module.css'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
type Props = {
    category: string;
    title: string;
    subtitle:string;
    content:string[]
}

interface CardProps{
    data:Props
}

export default function ItemCard({data}:CardProps){
    const {category, title, subtitle, content} = data;

    return (
        <div className={styles.cardContainer}>
            <AccordionItem value={`${subtitle}`}>
                    <div>
                        <AccordionTrigger className={styles.subTrigger}>
                            <p className = {styles.accordionSubtitle}>{subtitle}</p>
                        </AccordionTrigger>
                        <AccordionContent className={styles.content}>
                            {content.map((item,index)=>(
                            <li key={index} className={styles.item}>{item}</li>
                        ))}
                        </AccordionContent>
                    </div>
            </AccordionItem>
        
        </div>
    )
}