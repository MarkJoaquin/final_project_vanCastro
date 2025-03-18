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
                    <AccordionTrigger>{subtitle}</AccordionTrigger>
                    <AccordionContent>{content}</AccordionContent>
            </AccordionItem>
        
        </div>
    )
}