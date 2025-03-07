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

    const {id, title, icon, message} = card;

    return(
        <li className="cardItem">
            <p className="cardTitle">{title}</p>
            <img className="cardIcon" src={icon} alt={title} />
            <p className="cardMsg">{message}</p>
        </li>
    )
}