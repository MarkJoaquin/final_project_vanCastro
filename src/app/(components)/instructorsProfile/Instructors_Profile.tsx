import { fetchInstructors } from "../../../api/contentful/fetchInstructors";
import type { DrivingInstructor } from "../../../types/contentful";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card";
import styles from "./Instructors_Profile.module.css";

const InstructorsProfile = async () => {
  
    const instructorData = await fetchInstructors();

    if (!instructorData || !Array.isArray(instructorData)) {
      return <div>No instructor data available</div>;
    }

    const extractTextFromRichText = (richText: any) => {
      if (!richText || !richText.content) return '';
      return richText.content
        .map((node: any) => node.content.map((textNode: any) => textNode.value).join(''))
        .join(' ');
    };

    return (
      <section className={styles.profileSection}>
        <div className={styles.container}>
          <p className={styles.title}>Expert Tutor Ready to Guide You!</p>
          <div className={styles.instructorCards}>
            {instructorData.map((item: any) => {
              const instructor = item.fields as DrivingInstructor;
              const avatarUrl = instructor.avatar?.fields?.file?.url 
                ? `https:${instructor.avatar.fields.file.url}` 
                : '';

              return (
                <Card key={item.sys.id} className={styles.instructorCard}>
                  <div className={styles.instructorImage} >
                    {avatarUrl && (
                      <img 
                        src={avatarUrl}
                        alt={instructor.name}
                        className={styles.instructorImage}
                      />
                    )}
                    <CardTitle className={styles.instructorName}>{instructor.name}</CardTitle>
                    
                  </div>
                  
                  <CardContent  className={styles.cardContent}>
                    <div className={styles.instructorInfo}>
                      <img src="./images/Frame39.png" alt={instructor.name} className={styles.badge} />
                      <p>{instructor.yearsOfExperience} years of experience</p>
                    </div>
                    <div className={styles.instructorInfo}>
                      <img src="./images/Frame38.png" alt={instructor.name} className={styles.badge} />
                      <p> {instructor.languages}</p>
                    </div>
                    
                    <div className={styles.instructorInfo}> 
                      <img src="./images/Frame40.png" alt={instructor.name} className={styles.badge} />  
                      <p>{extractTextFromRichText(instructor.availability)}</p>
                    </div>
                    
                    
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    );
  } 

export default InstructorsProfile;
