
import styles from "./LetUsKnow.module.css"
import ContactForm from "../ContactSection/Contact_Form"; 

export default function LetUsKnow() {
  return (
    <div className={styles.questionSection}>
      <div className={styles.question}>
        <div className={styles.title}> 
          <p >Questions?</p>
          <p>Let Us Know!</p>
        </div>
        <ContactForm /> 
      </div>
    </div>
  );
}
