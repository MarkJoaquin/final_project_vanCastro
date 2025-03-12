import styles from './PlanCard.module.css'
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
        <li >
            <p>{category}</p>
            <p className="title">{title}</p>
            <p className="planName">{planName}</p>
            <div className="priceContainer">
                <p className="price"><span>$</span>{price}</p>
            </div>
            {featuresList.map((feature,index) => (
                <p className="feature" key={index}>{feature}</p>
            ))}
        </li>
    )
}