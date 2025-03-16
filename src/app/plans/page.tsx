import Hero from "../(components)/Hero/Hero";
import HereToHelp from "../(components)/HereToHelp/HereToHelp";
import PickAPlan from "../(components)/PickAPlan/PickAPlan";
import InstructorsProfile from "../(components)/instructorsProfile/Instructors_Profile";

export default function Plans() {
  const heroSection = {
    title: "Find the right course for your journey!",
    subtext:
      "From begginer to advanced, we're here to guide you to condifdent driving, every step of the way.",
    buttonText: "Book Now",
    background:
      "https://framerusercontent.com/images/LAwNc4MrUnMfbUcGSXC8GoQh07A.png",
    className: "plansHero",
    linkTo: "booking",
  };

  const hereToHelp = {
    title1: "We’re Here to Help",
    title2: "Let’s Customize Your Driving Plan!",
    subtitle: "Our courses are designed to fit the experience and ability level of each individual learner.",
    buttonText: "Contact Us",
    linkTo: "contact",
  }  

  return (
    <>
      <Hero data={heroSection} />
      <PickAPlan/>
      <HereToHelp data={hereToHelp} />
      <InstructorsProfile />


    </>
  );
} 
