import { fetchInstructors } from "@/app/api/contentful/fetchInstructors";
import CoachCard from "./CoachCard";
import styles from "./OurCoach.module.css";

const OurCoach = async () => {
  const instructorsData = await fetchInstructors();

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Our Coach</h2>
        <p className={styles.sectionDescription}>
          We are commited we will provide professional knowledge and lesson for
          you!
        </p>
        <span className={styles.span}></span>
      </div>
      <div className={styles.cardContainer}>
        {instructorsData && instructorsData.length>0 && instructorsData.map((instructor,index)=>{
                    return <CoachCard key={index} data = {instructor.fields} />
                 })}
      </div>
    </div>
  );
};

export default OurCoach;
