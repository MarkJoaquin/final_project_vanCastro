"use client";

import { useEffect, useState } from "react";
import styles from "./AboutVancastro.module.css";

type Props = {
  title: string;
  subtitle: string;
};

interface AboutVancastroProps {
  data: Props;
}

export default function AboutVancastro({ data }: AboutVancastroProps) {
  const { title, subtitle } = data;
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Activa la animación después de que el componente se monte
    const timer = setTimeout(() => setIsActive(true), 100);
    return () => clearTimeout(timer); // Limpia el temporizador al desmontar
  }, []);

  return (
    <div className={styles.aboutVancastro}>
      <h3 className={`${styles.title} ${styles.slideUp} ${isActive ? styles.active : ""}`}>
        {title}
      </h3>
      <p className={`${styles.subtitle} ${styles.slideUp} ${isActive ? styles.active : ""}`}>
        {subtitle}
      </p>
    </div>
  );
}