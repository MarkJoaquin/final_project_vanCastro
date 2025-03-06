import Link from "next/link";
import styles from "./Hero.module.css";
type Props = {
  title: string;
  subtext: string;
  buttonText: string;
  background: string;
  className: string;
  linkTo: string;
};

interface SectionProps {
  data: Props;
}

export default function Hero({ data }: SectionProps) {
  const { title, subtext, buttonText, background, className, linkTo } = data;

  return (
    <div
      className={styles.heroComponent}
      style={{
        backgroundImage: background?.endsWith(".mp4")
          ? "none"
          : `url(${background})`,
      }}
    >
      {background?.endsWith(".mp4") && (
        <video autoPlay loop muted className={styles.videoBackground}>
          <source src={background} type="video/mp4" />
        </video>
      )}

      {/* <div className={styles.overlay}></div> */}

      <div className={styles.heroContainer}>
        <div className={styles[className]}>
          <div className={styles.mainContent}>
            <h1 className={styles.heroTitle}>{title}</h1>
            <p className={styles.heroText}>{subtext}</p>
          </div>
          <div className = {styles.buttonContainer}>
            <Link href={`/${linkTo}`} className={styles.heroLink}>{buttonText}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
