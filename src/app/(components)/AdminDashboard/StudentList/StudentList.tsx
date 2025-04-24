"use client"

import { useEffect, useState } from "react";
import AdminTemplate from "../Template/AdminTemplate";
import { useAdminDataContext } from "@/app/(context)/adminContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion" ;
import styles from "./StudentList.module.css";
import { Input } from "@/components/ui/input" ;

interface ConfirmedLesson {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: string;
  plan: string;
  price: string;
  status: string;
  paymentStatus: string;
  trackingNumber: string;
  instructorId: string;
  licenseClass?: string;
  paymentMethod?: string;
  student: {
      name: string;
  };
  location: {
      name: string;
      city: string;
  };
}

interface LicenseClass {
  id: string;
  name: string;
}

export default function StudentList() {
  const [confirmedLessons, setConfirmedLessons] = useState<ConfirmedLesson[]>([]);
  const [licenseClasses, setLicenseClasses] = useState<LicenseClass[]>([]);
  const { loginedInstructorData } = useAdminDataContext();
  const instructorId = loginedInstructorData?.id;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchConfirmedLessons = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/lessons/confirmed");
      if (!res.ok) {
        const errorData = await res.json();
        console.error("API error:", errorData);
        throw new Error(errorData.error || "Error fetching confirmed lessons");
      }
      const data = await res.json();
      console.log("Confirmed lessons received:", data);
      setConfirmedLessons(data);
    } catch (error) {
      console.error("Error fetching confirmed lessons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLicenseClasses = async () => {
    try {
      const res = await fetch("/api/plans/classes");
      if (!res.ok) {
        console.error("Failed to fetch license classes");
        return;
      }
      const data = await res.json();
      setLicenseClasses(data);
    } catch (error) {
      console.error("Error fetching license classes:", error);
    }
  };

  useEffect(() => {
    fetchConfirmedLessons();
    fetchLicenseClasses();
  }, []);

  const assignedLessons = confirmedLessons
    .filter((lesson) => {
      const matchesInstructor = lesson.instructorId === instructorId;
      const matchesSearch = searchQuery.trim() === "" || 
        lesson.student.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesInstructor && matchesSearch;
    });

  const calculateClassDuration = (startTime: string, endTime: string): number => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const durationInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    return durationInMinutes;
  };

  const formatLessonDate = (lesson: ConfirmedLesson) => {
    const date = new Date(lesson.date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
    return `${date}`;
  };

  // Map licenseClass ID to name
  const getLicenseClassName = (id?: string) => {
    if (!id) return "";
    const found = licenseClasses.find((lc) => lc.id === id);
    return found ? found.name : id;
  };

  const CustomMainComponent = () => {
    if (isLoading) {
      return <p className="text-center py-4">Loading confirmed students...</p>;
    }
  
    if (assignedLessons.length === 0) {
      return <p className="text-center py-4">No confirmed students to display</p>;
    }
  
    const groupLessonsByStudent = () => {
      const grouped: { [studentName: string]: ConfirmedLesson[] } = {};
  
      assignedLessons.forEach((lesson) => {
        const name = lesson.student.name;
        if (!grouped[name]) {
          grouped[name] = [];
        }
        grouped[name].push(lesson);
      });
  
      return grouped;
    };
  
    const groupedLessons = groupLessonsByStudent();
  
    return (
      <div className="w-full space-y-6">
        <Accordion type="multiple" className="w-full space-y-4">
          {Object.entries(groupedLessons).map(([studentName, lessons]) => (
            <AccordionItem key={studentName} value={studentName}>
              <AccordionTrigger className="flex justify-between px-4 py-3 bg-white rounded-md shadow-sm hover:shadow-md transition-all cursor-pointer">
                {studentName}
              </AccordionTrigger>
              <AccordionContent className={`${styles.studentDetail} bg-gray-50 px-6 py-4 rounded-b-md `}>
                <div className="space-y-6 border-gray-200">
                  {lessons.map((lesson, index) => (
                    <div key={index} className= "bg-white p-6 rounded-md shadow-sm border-b border-gray-200 last:border-b-0">
                    <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
                      {/* Columna 1 - Detalles generales */}
                      <div>
                        <p><strong>Plan:</strong> {lesson.plan}</p>
                        <p><strong>Date:</strong> {formatLessonDate(lesson)}</p>
                        <p><strong>Time:</strong> {lesson.startTime} - {lesson.endTime}</p>
                        <p><strong>Duration:</strong> {calculateClassDuration(lesson.startTime, lesson.endTime)} minutes</p>
                        <p><strong>Status:</strong> {lesson.status}</p>
                        <p><strong>License Class:</strong> {getLicenseClassName(lesson.licenseClass)}</p>
                      </div>

                      {/* Columna 2 - Información adicional */}
                      <div>
                        <h4 className="font-semibold mb-1">Location</h4>
                        <p>{lesson.location?.name || "No location"}</p>
                        {/* <p>{lesson.location?.city || "No city"}</p> */}

                        <h4 className="font-semibold mt-4 mb-1">Additional Information</h4>
                        <p><span className="text-gray-600">Tracking Number:</span> {lesson.trackingNumber}</p>
                        {lesson.paymentMethod && (
                          <p><span className="text-gray-600">Payment Method:</span> {lesson.paymentMethod}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="w-full">
      <div className={`${styles.LessonSection} w-[80%] m-auto mt-[2rem]`}>
        <div className="flex justify-between items-center flex-wrap gap-[0.5rem]">
          <h2 className={`${styles.title} text-2xl font-bold `}>Students List</h2>
          <div className="flex gap-[1rem]">
            <Input
              placeholder="Student name"
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-white py-5"
            />
          </div>
        </div>
      </div>
      <div className="w-[80%] m-auto mt-4">
        <CustomMainComponent />
      </div>
    </div>
  );
}
