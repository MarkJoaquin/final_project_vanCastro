"use client"

import { useEffect, useState } from "react";
import AdminTemplate from "../Template/AdminTemplate";
import { useAdminDataContext } from "@/app/(context)/adminContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import styles from "./StudentList.module.css";
import { Input } from "@/components/ui/input";

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
  const [planLessonsMap, setPlanLessonsMap] = useState<Record<string, number>>({});

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

  const fetchTotalLessonsPerPlan = async () => {
    try {
      const res = await fetch("/api/lessons/lessonsCount");
      if (!res.ok) {
        console.error("Failed to fetch total lessons per plan");
        return;
      }
      const data = await res.json();

      // Convert to an object like { "Plan A": 10, "Plan B": 8 }
      const map: Record<string, number> = {};
      data.forEach((plan: { name: string; lessons: number }) => {
        map[plan.name.trim().toLowerCase()] = plan.lessons;
      });

      setPlanLessonsMap(map);
      console.log("Plan lessons map:", map);
    } catch (error) {
      console.error("Error fetching total lessons per plan:", error);
    }
  };

  const updateLessonStatus = async (lessonId: string) => {
    try {
      const res = await fetch(`/api/lessons/${lessonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      if (!res.ok) throw new Error("Failed to update status");
    } catch (err) {
      console.error("Error updating lesson status:", err);
    }
  };

  useEffect(() => {
    fetchConfirmedLessons();
    fetchLicenseClasses();
    fetchTotalLessonsPerPlan();
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

  // Function to get pending lessons count for a student based on their plan
  const getPendingLessonsCount = (lessons: ConfirmedLesson[], planName: string, totalLessons: number): number => {
    const completedLessons = lessons.filter(
      (lesson) => lesson.plan.toLowerCase() === planName.toLowerCase() && lesson.status.toLowerCase() === "confirmed"
    ).length;
    return totalLessons - completedLessons;
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

    const isLessonCompletedByTime = (lesson: ConfirmedLesson): boolean => {
      const today = new Date();
      const lessonDateTime = new Date(`${lesson.date}T${lesson.endTime}`);
      return lessonDateTime < today;
    };

    const updateLessonStatus = async (lessonId: string) => {
      try {
        const res = await fetch(`/api/lessons/${lessonId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "completed" }),
        });
        if (!res.ok) throw new Error("Failed to update status");
      } catch (err) {
        console.error("Error updating lesson status:", err);
      }
    };

    return (
      <div className="w-full space-y-6">
        <Accordion type="multiple" className="w-full space-y-4">
          {Object.entries(groupedLessons).map(([studentName, lessons]) => (
            <AccordionItem key={studentName} value={studentName}>
              <AccordionTrigger className="flex justify-between px-4 py-3 bg-white rounded-md shadow-sm hover:shadow-md transition-all cursor-pointer">
                {studentName}
              </AccordionTrigger>
              <AccordionContent className="bg-gray-50 px-6 py-4 rounded-b-md">
              {lessons.map((lesson, index) => {
                const normalizedPlanName = lesson.plan.trim().toLowerCase();
                const total = planLessonsMap[normalizedPlanName] ?? 0;
                const lessonEndTime = new Date(`${lesson.date}T${lesson.endTime}`);
                // Check if the lesson is completed by time
                const now = new Date();

                useEffect(() => {
                  if (lesson.status !== "completed" && lessonEndTime < now) {
                    updateLessonStatus(lesson.id);
                  }
                }, [lessonEndTime, lesson.status]);
                const completed = lessons.filter(
                  (l) =>
                    l.plan.trim().toLowerCase() === normalizedPlanName &&
                    l.status.toLowerCase() === "completed"
                ).length;


                  return (
                    <div key={index} className="bg-gray-50 px-6 py-4 rounded-b-md">
                      <p><strong>Plan:</strong> {lesson.plan}</p>
                      <p><strong>Date:</strong> {formatLessonDate(lesson)}</p>
                      <p><strong>Time:</strong> {lesson.startTime} - {lesson.endTime}</p>
                      <p><strong>Duration:</strong> {calculateClassDuration(lesson.startTime, lesson.endTime)} minutes</p>
                      <p><strong>Status:</strong> {lesson.status}</p>
                      <p><strong>License Class:</strong> {getLicenseClassName(lesson.licenseClass)}</p>
                      <p>
                        <strong> Completed Lessons: </strong>
                        {completed} of {total}
                      </p>
                      <p>
                        <strong>Pending Lessons : </strong>
                        {total - completed}
                      </p>
                    </div>
                  );
                })}
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
