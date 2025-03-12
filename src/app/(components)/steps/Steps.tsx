"use client"

import StepCard from "./StepsCard";
import Link from "next/link";
import styles from "./Steps.module.css"

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
    data: Props[]
}

export default function Steps({ data }: { data: StepCardProps['data'] }) {
    return (      
        <div className={styles.sectionStep}>
            <div className={styles.sectionTitle}>
                <p className={styles.questioTitle}>How it Works?</p>
                <p className={styles.questioTitle}>Follow 3 Simple Steps</p>
            </div>
            <ul className={styles.stepsList}>
               {data.map((cardStep: Props) => (
                <StepCard key={cardStep.id} cardStep={cardStep} /> 
               ))} 
            </ul>
        </div>
    );
}
