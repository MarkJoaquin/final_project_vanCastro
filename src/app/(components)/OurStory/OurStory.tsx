"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./OurStory.module.css";
import Image from "next/image";

export default function OurStory() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
        (entries) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
            setIsVisible(true); 
            }
        },
        { threshold: 0.2 } 
        );

        if (sectionRef.current) {
        observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section
        ref={sectionRef}
        className={`${styles.ourStorySection}`}
        >
        <div className={styles.ourStory}>
            {/* Título con animación */}
            <div
            className={`${styles.title} ${styles.slideUp} ${
                isVisible ? styles.active : ""
            }`}
            >
            <h3>Our Story</h3>
            <div className={styles.span}></div>
            </div>

            {/* Imágenes con animación */}
            <div
            className={`${styles.images} ${styles.slideUp} ${
                isVisible ? styles.active : ""
            }`}
            >
            <Image
                src="https://framerusercontent.com/images/SDVr17tl02j6UOosS3BI9EvopDA.png?scale-down-to=1024"
                alt="Award 1"
                width={300}
                height={300}
                className={styles.img1}
            />
            <Image
                src="https://framerusercontent.com/images/QPFnKBJVdKUtX9OAXcKoXrGVt8.png?scale-down-to=1024"
                alt="Award 2"
                width={300}
                height={300}
                className={styles.img2}
            />
            </div>

            
            <div
            className={`${styles.infoSide} ${styles.slideUp} ${
                isVisible ? styles.active : ""
            }`}
            >
            <div className={styles.storyText}>
                <p>
                With over 4 years of experience, VanCastro Driving School has
                helped thousands of students become skilled and responsible
                drivers. Our certified instructors are passionate about road
                safety and driver education.
                </p>
            </div>
            <div className={styles.cardsContainer}>
                <div className={styles.cards}>
                <h2>100+</h2>
                <p>Google reviews</p>
                </div>
                <div className={styles.cards}>
                <h2>200+</h2>
                <p>Students Trained</p>
                </div>
                <div className={styles.cards}>
                <h2>95%</h2>
                <p>Pass rate</p>
                </div>
                <div className={styles.cards}>
                <h2>4</h2>
                <p>Locations</p>
                </div>
            </div>
            </div>
        </div>
        </section>
    );
}
