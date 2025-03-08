import AlumniCarousel from "./(components)/Carousels/AlumniCarousel";
import GoogleCarousel from "./(components)/Carousels/GoogleCarousel";
import YoutubeCarousel from "./(components)/Carousels/YoutubeCarousel";
import Dummy from "./(components)/Dummy/Dummy";
import Hero from "./(components)/Hero/Hero";
import WhyUs from './(components)/WhyUs/WhyUs';
import PickAPlan from "./(components)/PickAPlan/PickAPlan";
import LicensedInstructors from "./(components)/Licensed_Instructors/Licensed_Instructors";

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
  return (
    <>
      <Hero data={heroSection} />
      <WhyUs data = {whyUsData}/>
      <Dummy />
      {/* <AlumniCarousel/>
      <GoogleCarousel/>
      <YoutubeCarousel/> */}
      <LicensedInstructors />
      <PickAPlan/>

    </>
  );
}
