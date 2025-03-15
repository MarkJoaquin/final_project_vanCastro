"use client"

import StepCard from "./StepsCard";
import styles from "./Steps.module.css"
import type { StepsSection } from "@/types/stepsSection";

interface StepCardProps {
    data: StepsSection[]
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