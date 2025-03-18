import styles from './AboutVancastro.module.css';

type Props = {
    title: string;
    subtitle: string;
};

interface AboutVancastroProps {
    data: Props;
}

export default function AboutVancastro({data}: AboutVancastroProps) {
    const { title, subtitle } = data;

    return (
        <div className={styles.aboutVancastro}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.subtitle}>{subtitle}</p>
        </div>
    )
}