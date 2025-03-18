import styles from "./VancastroAward.module.css";
import Image from "next/image";

export default function VancastroAward() {
  return (
    <div className={styles.vancastroAward}>
        <div className={styles.images}>
            <Image
                src="https://framerusercontent.com/images/SDVr17tl02j6UOosS3BI9EvopDA.png?scale-down-to=1024"
                alt="Award 1"
                width={300}
                height={300}
            />
            <Image
                src="https://framerusercontent.com/images/QPFnKBJVdKUtX9OAXcKoXrGVt8.png?scale-down-to=1024"
                alt="Award 2"
                width={300}
                height={300}
            />
        </div>
        <p className={styles.title}>
            With over 4 years of experience, VanCastro Driving School has helped
            thousands of students become skilled and responsible drivers. Our
            certified instructors are passionate about road safety and driver
            education.
        </p>
    </div>
  );
}
