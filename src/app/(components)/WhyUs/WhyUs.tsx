import ItemCard from './ItemCard'
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
        <div className = 'sectionContainer'>
            <h2>Why choose us?</h2>
            <div className="listContainer">
                <ul className="list">
                    {data.map((card:Props)=>(
                        <ItemCard key = {card.id} card = {card}/>
                    ))}
                </ul>
            </div>
        </div>
    )
}