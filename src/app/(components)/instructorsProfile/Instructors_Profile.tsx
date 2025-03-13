/* "use client"

import { fetchInstructors } from "@/api/contentful/fetchInstructors";
import type { DrivingInstructor } from "@/types/contentful";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import styles from "./Instructors_Profile.module.css";

const InstructorsProfile = () => {
    const [instructors, setInstructors] = useState<DrivingInstructor[]>([]);

    useEffect(() => {
        const getInstructors = async () => {
            const data = await fetchInstructors();
            if (data && data.length > 0) {
                setInstructors(data.map((item: any) => item.fields));
            }
        };
        getInstructors();
    }, []);

    return (
        <div className={styles.profileContainer}>
            {instructors.length > 0 && instructors.map((instructor, index) => {
                const avatarUrl = (instructor.avatar as any)?.fields?.file?.url || '/default-avatar.png';
                
                return (
                    <Card key={index} className={styles.profileCard}>
                        <CardHeader>
                            <img 
                                src={avatarUrl} 
                                alt={instructor.name} 
                                className={styles.avatar}
                            />
                            <CardTitle>{instructor.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Phone:</strong> {instructor.phone}</p>
                            <p><strong>Email:</strong> {instructor.email}</p>
                            <p><strong>Availability:</strong> {instructor.availability}</p>
                            <p><strong>Years of Experience:</strong> {instructor.yearsOfExperience}</p>
                            <p><strong>Languages:</strong> {instructor.languages.join(", ")}</p>
                        </CardContent>
                        <CardFooter>
                            {/* Add any footer content here if needed }
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
};

export default InstructorsProfile;*/
 