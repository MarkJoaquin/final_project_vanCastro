import styles from "./StepsCard.module.css";
import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
  name: string;
  id: string;
  title: string;
  mainText: string[] | { title: string; description: string }[];
  subText: {
    text: string;
    linkText: string;
    linkTo: string;
    className: string;
  };
  className: string;
  LinkTo: string;
};

interface StepCardProps {
  cardStep: Props;
}

export default function StepCard({ cardStep }: StepCardProps) {
  return (
    <li>
     
      <motion.div
        className={`${styles.mainStep} ${styles[cardStep.className]}`}
        initial={{ opacity: 0, y: 50 }}  
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, amount: 0.5 }} 
        transition={{ duration: 0.8 }}  
      >
        <div className={styles.stepContainer}>
          <motion.div
            className={styles.stepId}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true, amount: 0.2 }} 
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className={styles.stepIdName}>
              {cardStep.name} {cardStep.id}
            </div>
          </motion.div>

          <div className={styles.stepContainer} id={cardStep.id}>
            <motion.p
              className={styles.StepTitle}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true, amount: 0.2 }} 
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              {cardStep.title}
            </motion.p>

            {Array.isArray(cardStep.mainText) && cardStep.mainText.length > 0 && (
              <div className={styles.mainTextContainer}>
                {cardStep.mainText.map((text, index) =>
                  typeof text === 'object' ? (
                    <motion.p
                      key={index}
                      className={`${styles.mainText} ${styles.titleDescription} ${styles.withTitle}`}
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{ delay: 1 + index * 0.2, duration: 0.3 }}
                    >
                      <strong className={styles.innerTitle}>{text.title}</strong>
                      <span className={styles.innerDescription}>{text.description} </span>
                    </motion.p>
                  ) : (
                    <motion.p
                      key={index}
                      className={styles.mainText}
                      initial={{ opacity: 0, x: -50}}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ delay: 1 + index * 0.2, duration: 0.3}}
                    >
                      {text}
                    </motion.p>
                  )
                )}
              </div>
            )}

            {cardStep.subText && (
              <motion.p
                className={styles.subText}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, amount: 0.2 }} 
                transition={{ delay: 1.2, duration: 0.3 }}
              >
                {cardStep.subText.text}{' '}
                <Link
                  href={cardStep.subText.linkTo}
                  target="_blank"
                  className={`${styles[cardStep.subText.className]}`}
                >
                  {cardStep.subText.linkText}
                </Link>
                {' '}to connect with a partner for language support
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </li>
  );
}

