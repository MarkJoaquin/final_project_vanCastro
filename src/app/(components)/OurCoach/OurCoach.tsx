// 'use client'
// import { useState, useEffect } from "react";
import { fetchInstructors } from "@/app/api/contentful/fetchInstructors";
import CoachCard from "./CoachCard";
import styles from "./OurCoach.module.css";
import { Entry, EntrySkeletonType } from "contentful";

const coachInformation = [
  {
    image:
      "https://framerusercontent.com/images/sPLYqciobHmz2LAEu2z5G3BjNfQ.jpg?scale-down-to=1024",
    name: "Anderson",
    phoneNumber: "+1 604 600 9173",
    description:
      "With experience in training in Brazil and Canada, Anderson started out taking care of the administrative side of VanCastro and over time began to admire how happy and fulfilled Anderson had become with the birth and growth of VanCastro. In a short time, she decided to study to also acquire her license to also become an Instructor Driver. Andresa also has over 25 years driving experience. If you have a challenge, Andresa is the woman to call.",
  },
  {
    image:
      "https://framerusercontent.com/images/UTue8FAX2kSZ9cK5JZKbJ2zWDM.jpg?scale-down-to=1024",
    name: "Andressa",
    phoneNumber: "+1 778 680 5613",
    description:
      "With experience in training in Brazil and Canada, Andresa started out taking care of the administrative side of VanCastro and over time began to admire how happy and fulfilled Anderson had become with the birth and growth of VanCastro. In a short time, she decided to study to also acquire her license to also become an Instructor Driver. Andresa also has over 25 years driving experience. If you have a challenge, Andresa is the woman to call.",
  },
];

// type Props = {
//     image:string;
//     name:string;
//     phoneNumber:string;
//     description:string;
// }

// export default function OurCoach (){
//     const [entries, setEntries] = useState<DrivingInstructor[]>([])

//     useEffect(()=>{

//         const getCoachData = async () => {
//             const data = await fetchInstructors();

//             if(data){
//                 // const formattedData = data.map((coach)=>({
//                 //     image:coach.fields.avatar3 as string,
//                 //     name: coach.fields.name as string,
//                 //     phoneNumber: coach.fields.phone as string,
//                 //     description: coach.fields.description as string
//                 // }))
//                 // console.log('Data ===> ', data)

//                 console.log('CoachData ===> ', data)

//                 setEntries(data)

//             } else {
//                 console.error('Error fetching coach data: no data available')
//             }

//         }

//         getCoachData();

//     },[])

//     return(
//         <div className={styles.sectionContainer}>
//             <div className={styles.header}>
//                 <h2 className={styles.sectionTitle}>Our Coach</h2>
//                 <p className={styles.sectionDescription}>We are commited we will provide professional knowledge and lesson for you!</p>
//                 <span className={styles.span}></span>
//             </div>
//             <div className="cardContainer">
//                 {/* {coachData.map((coach, index)=>(
//                     <CoachCard key={index} data = {coach}/>
//                 ))} */}
//             </div>
//         </div>
//     )
// }

const OurCoach = async () => {
  const instructorsData = await fetchInstructors();
    // instructorsData?.map((instructor)=> {
    // console.log("InstructorData ===> ", instructor.fields);
        
    // })


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
        {/* {coachData.map((coach, index)=>(
                    <CoachCard key={index} data = {coach}/>
                 ))} */}
        {instructorsData && instructorsData.length>0 && instructorsData.map((instructor,index)=>{
                    return <CoachCard key={index} data = {instructor.fields} />
                 })}
      </div>
    </div>
  );
};

export default OurCoach;
