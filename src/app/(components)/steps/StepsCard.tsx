import styles from "./StepsCard.module.css"
import Link from "next/link";

type Props = {
    name: string,
    id: string,
    title: string 
    mainText: string[] | { title: string; description: string }[],
    subText: {
        text: string;
        linkText: string;
        linkTo: string;
        className: string;
    },
    className: string 
    LinkTo: string
}

interface StepCardProps {
    cardStep: Props
}

export default function StepCard({ cardStep }: StepCardProps) {
    // const { name, id, title, mainText, subText, className, LinkTo } = cardStep;
  
    return (
      <li>
        <div className={`${styles.mainStep} ${styles[cardStep.className]}`}>
          <div className={styles.stepContainer}>
            <div className={styles.stepId}>
              <div className={styles.stepIdName}>
                {cardStep.name} {cardStep.id}
              </div>
            </div>
            <div className={styles.stepContainer} id={cardStep.id}>
              <p className={styles.StepTitle}>{cardStep.title}</p>
              {Array.isArray(cardStep.mainText) && cardStep.mainText.length > 0 && (
                <div className={styles.mainTextContainer}>
                  {cardStep.mainText.map((text, index) => (
                    typeof text === 'object' ? (
                      <p key={index} className={`${styles.mainText} ${styles.titleDescription} ${styles.withTitle}`}>
                        <strong className={styles.innerTitle}>{text.title}</strong>
                        <span className={styles.innerDescription}>{text.description} </span>
                      </p>
                    ) : (
                      <p key={index} className={styles.mainText}>
                        {text}
                      </p>
                    )
                  ))}
                </div>
              )}
              {cardStep.subText && (
                <p className={styles.subText}>
                  {cardStep.subText.text}
                  {' '}
                  <Link 
                    href={cardStep.subText.linkTo} target="_blank"
                    className={`${styles[cardStep.subText.className]}`}
                  >
                    {cardStep.subText.linkText}
                  </Link>
                  {' '}to connect with a partner for language support
                </p>
              )}
            </div>
          </div>
        </div>
      </li>
    );
}
