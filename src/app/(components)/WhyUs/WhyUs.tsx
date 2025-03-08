import ItemCard from './ItemCard'
import styles from './WhyUs.module.css'
type Props = {
    id: number,
    title: string,
    icon: string,
    message: string
}

interface CardsProps {
    data:Props[]
}

export default function WhyChooseUs({data}: CardsProps){
    return(
        <div className = {styles.sectionContainer}>
            <h2>Why choose us?</h2>
            <div className={styles.listContainer}>
                <ul className={styles.list}>
                    {data.map((card:Props)=>(
                        <ItemCard key = {card.id} card = {card}/>
                    ))}
                </ul>
            </div>
        </div>
    )
}