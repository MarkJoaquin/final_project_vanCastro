import { features } from "process";

type Props = {
    category: string;
    title: string;
    planName: string;
    price: string,
    featuresList:string[];
}


interface CardProps {
    data: Props
}


export default function PlanCard({data}: CardProps) {

    const { category, title, planName, price, featuresList } = data

    return(
        <li>
            <p className="title">{title}</p>
            <p className="planName">{planName}</p>
            <div className="priceContainer">
                <p className="price"><span>$</span>{price}</p>
            </div>
            {featuresList.map((feature) => (
                <p className="feature">{feature}</p>
            ))}
        </li>
    )
}