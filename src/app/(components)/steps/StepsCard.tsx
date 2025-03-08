import styles from "./StepsCard.module.css"

type Props = {
    name: string,
    id: string,
    title: string 
    mainText: string[] | { title: string; description: string }[],
    subText: string,
    className: string 
    LinkTo: string
}

interface StepCardProps {
    cardStep: Props
}

export default function StepCard ({cardStep}: StepCardProps){

    const { name, id, title, mainText, subText, className, LinkTo} = cardStep;
    
    return (
        <li>
            <div className={`${styles.mainStep} ${styles[cardStep.className]}`}>
                <div className={styles.stepContainer}>
                    <div className={styles.stepId}>
                        {cardStep.name} {cardStep.id}
                    </div>
                    <div className={styles.stepContainer} id={cardStep.id}>
                        <p className={styles.StepTitle}>{cardStep.title}</p>
                        {Array.isArray(cardStep.mainText) && cardStep.mainText.length > 0 && (
                            <div>
                                {cardStep.mainText.map((text, index) => (
                                    
                                    typeof text === 'object' ? (
                                        <p key={index} className={`${styles.mainText} ${styles.titleDescription} ${styles.withTitle}`}>
                                            <strong>{text.title}:</strong> {text.description}
                                        </p>
                                    ) : (
                                        <p key={index} className={styles.mainText}>
                                            {text}
                                        </p>
                                    )
                                ))}
                            </div>
                        )}
                        {cardStep.subText && <p className={styles.subText}>{cardStep.subText}</p>}
                    </div>
                </div>
            </div>
        </li>

    )
}