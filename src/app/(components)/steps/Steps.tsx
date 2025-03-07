"use client"

import Link from "next/link";
import styles from "./Steps.module.css"
import { useEffect, useState } from "react";

type Props = {
    name: string,
    id: string,
    title: string 
    mainText: string [],
    subText: string,
    className: string 
    LinkTo: string
}

interface SectionProps {
    data: Props
}

export default function Steps({ data }: { data: SectionProps['data'] }) {
    const [showTitles, setShowTitles] = useState<boolean>(false);

    useEffect(() => {
        // Verificamos si ya se mostraron los títulos iniciales usando localStorage
        const hasShownTitles = localStorage.getItem('hasShownTitles');

        if (!hasShownTitles) {
            // Si no se han mostrado, mostramos los títulos
            setShowTitles(true);
            // Guardamos en localStorage que los títulos han sido mostrados
            localStorage.setItem('hasShownTitles', 'true');
        }
    }, []); 

    return (
        <>
            {showTitles && (
                <div>
                    <p className={styles.questioTitle}>How it Works?</p>
                    <p className={styles.followTitle}>Follow 3 Simple Steps</p>
                </div>
            )}

            <div className={`${styles.mainStep} ${styles[data.className]}`}>
                <div className={styles.stepContainer}>
                    <div className={styles.stepId}>
                        {data.name} {data.id}
                    </div>
                    <div className={styles.stepContainer} id={data.id}>
                        <p className={styles.StepTitle}>{data.title}</p>
                        {Array.isArray(data.mainText) && data.mainText.length > 0 && (
                            <div>
                                {data.mainText.map((text, index) => (
                                    
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
                        {data.subText && <p className={styles.subText}>{data.subText}</p>}
                    </div>
                </div>
            </div>
        </>
    );
}