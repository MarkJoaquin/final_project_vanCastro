import SelectorBtn from "./(components)/Button/SelectorBtn";
import AlumniCarousel from "./(components)/Carousels/AlumniCarousel";
import GoogleCarousel from "./(components)/Carousels/GoogleCarousel";
import YoutubeCarousel from "./(components)/Carousels/YoutubeCarousel";
import Dummy from "./(components)/Dummy/Dummy";
import Hero from "./(components)/hero/Hero";
import WhyUs from './(components)/WhyUs/WhyUs'
import Review from "./Review/Review";
import Steps from "./(components)/steps/Steps";
import LicensedInstructors from "./(components)/Licensed_Instructors/Licensed_Instructors";
import type { StepsSection } from "@/types/stepsSection";

export default function Home() {
  const heroSection = {
    title: "Join Us on the Road.",
    subtext: "We're here to support you every step of the way.",
    buttonText: "View Plans",
    background:
      "https://framerusercontent.com/assets/kzYOHEDdVO42MaFwzclp3L2vcUI.mp4",
    className: "homeHero",
    linkTo: "plans",
  };

  const whyUsData = [
    {
      id: 1,
      title: 'Flexible Scheduling',
      icon: 'https://framerusercontent.com/images/07g0uSGHOaBSsu18alOydk60.png',
      message: 'Choose times and locations that suit with a plan.'
    },
    {
      id: 2,
      title: 'Bilingual Support',
      icon: 'https://framerusercontent.com/images/EhJc65GbYzVXHYBjP9V9Vy2urpc.png',
      message: 'Learn in Portuguese or English with our bilingual coaches.'
    },
    {
      id: 3,
      title: 'High Success Rate',
      icon: 'https://framerusercontent.com/images/eJMjzly50igV76mZOnxnr73Kx4w.png',
      message: 'Our experienced instructors prepare you for the test.'
    },
    {
      id: 4,
      title: 'Mock Test & Scheduling',
      icon: 'https://framerusercontent.com/images/TgVAsQ1BjJVw8gC4DyZlTTnE4c.png',
      message: 'Build confidence with a mock test and Road Test support.'
    },
  ]

  

  const btnName = ["Alumni Review","Google Review","Video Review"];


  

  const steps = [
    {
      name: "Step", 
      id: "1",
      title: "Take the Knowledge Test",
      mainText: [
        "Prepare for and complete the Knowledge Test to assess your understanding of driving rules"
      ],
      subText: {
        text: "Need translation? ",
      linkText: "Click here",
      linkTo: "https://www.facebook.com/ICBCKnowledgeTestMaterial/",
      className: "link", 
      },
      className: "stepOne",
      LinkTo: "https://www.facebook.com/ICBCKnowledgeTestMaterial/"
    },
    {
      name: "Step", 
      id: "2",
      title: "Phone Consultation",
      mainText: [
        "Discuss available plans tailored to your needs  (e.g. changing licenses or starting as a beginner)",
      ],
      subText: "",
      className: "stepTwo",
      LinkTo: ""
    },
    {
      name: "Step", 
      id: "3",
      title: "Road Test Preparation",
      mainText: [
        { title: "Convenient Pickup & Drop-off", description: "We'll pick you up and drop you off at the meeting point." },
        { title: "Meet at a Designated Location", description: "Typically at a SkyTrain station." },
        { title: "Road Test Scheduling", description: "We'll help you schedule your Road Test." }
      ],
      subText: "",
      className: "stepThree",
      LinkTo: ""
    }
  ];  


  return (
    <>
   
      <Hero data={heroSection} />
      <WhyUs data = {whyUsData}/>
      {/* <Dummy /> */}
      <LicensedInstructors />
      <Review btnName = {btnName}/>
      <Steps data = {steps as StepsSection[]} />

      {/* <AlumniCarousel/>
      <GoogleCarousel/>
      <YoutubeCarousel/> */}

    </>
  );
}
