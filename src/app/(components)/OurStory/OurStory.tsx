import styles from "./OurStory.module.css";
import Image from "next/image";

export default function OurStory() {
  return (
    <div className={styles.ourStory}>
        <div className={styles.title}>
            <h3>Our Story</h3>
            <div className={styles.span}></div>
        </div>
        <div className={styles.images}>
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
        <div className={styles.infoSide}>
            <div className={styles.storyText}>
                <p>
                With over 4 years of experience, VanCastro Driving School has helped
                thousands of students become skilled and responsible drivers. Our
                certified instructors are passionate about road safety and driver
                education.
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
  );
}
