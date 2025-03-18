import styles from "./VancastroAward.module.css";
import Image from "next/image";

export default function VancastroAward() {
  return (
    <div className={styles.vancastroAward}>
        <div className={styles.images}>
            <Image
                src="https://framerusercontent.com/images/QPFnKBJVdKUtX9OAXcKoXrGVt8.png"
                alt="Award 1"
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
