import { fetchInstructors } from "../../../api/contentful/fetchInstructors";
import type { DrivingInstructor } from "../../../types/contentful";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card";
import styles from "./Instructors_Profile.module.css";

const InstructorsProfile = async () => {
  
    const instructorData = await fetchInstructors();

    if (!instructorData || !Array.isArray(instructorData)) {
      return <div>No instructor data available</div>;
    }

    // Helper function to extract text from rich text field
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
                  <CardHeader>
                    {avatarUrl && (
                      <img 
                        src={avatarUrl}
                        alt={instructor.name}
                        className={styles.instructorImage}
                      />
                    )}
                    <CardTitle>{instructor.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Phone: {instructor.phone}</p>
                    <p>Email: {instructor.email}</p>
                    <p>Availability: {extractTextFromRichText(instructor.availability)}</p>
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
