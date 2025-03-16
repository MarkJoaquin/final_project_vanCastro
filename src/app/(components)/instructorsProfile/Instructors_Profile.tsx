'use client';

import { useEffect, useState } from 'react';
import { fetchInstructors } from "../../../api/contentful/fetchInstructors";
import type { DrivingInstructor } from "../../../types/contentful";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card";
import styles from "./Instructors_Profile.module.css";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import {  Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const InstructorsProfile = () => {
  const [instructorData, setInstructorData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchInstructors();
        if (data && Array.isArray(data)) {
          setInstructorData(data);
        } else {
          setError('No instructor data available');
        }
      } catch (error) {
        console.error('Error loading instructor data:', error);
        setError('Failed to load instructor data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const extractTextFromRichText = (richText: any) => {
    if (!richText || !richText.content) return '';
    return richText.content
      .map((node: any) => node.content.map((textNode: any) => textNode.value).join(''))
      .join(' ');
  };

  if (loading) {
    return <div>Loading instructor profiles...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const renderCard = (item: any) => {
    const instructor = item.fields;
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
          <CardTitle className={styles.instructorName}>{instructor.name}</CardTitle>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          <div className={styles.instructorInfo}>
            <img src="./images/Frame39.png" alt={instructor.name} className={styles.badge} />
            <p>{instructor.yearsOfExperience} years of experience</p>
          </div>
          <div className={styles.instructorInfo}>
            <img src="./images/Frame38.png" alt={instructor.name} className={styles.badge} />
            <p>{instructor.languages}</p>
          </div>
          <div className={styles.instructorInfo}> 
            <img src="./images/Frame40.png" alt={instructor.name} className={styles.badge} />  
            <p>{extractTextFromRichText(instructor.availability)}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Link 
            href="/contact" 
            className={styles.contactButton}
          >
            Contact Us
          </Link>
        </CardFooter>
      </Card>
    );
  };

  return (
    <section className={styles.profileSection}>
      <div className={styles.container}>
        <p className={styles.title}>Expert Tutor Ready to Guide You!</p>
        
        {/* Desktop Layout */}
        <div className={styles.desktopCards}>
          {instructorData.map((item) => renderCard(item))}
        </div>

        {/* Mobile Swiper */}
        <div className={styles.mobileSwiper}>
          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={16}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation
            
          >
            {instructorData.map((item) => (
              <SwiperSlide key={item.sys.id}>
                {renderCard(item)}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default InstructorsProfile;
