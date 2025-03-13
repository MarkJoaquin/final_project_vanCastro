import Hero from "../(components)/hero/Hero";
import Dummy from "../(components)/Dummy/Dummy";
/* import InstructorsProfile from "../(components)/instructorsProfile/Instructors_Profile"; */

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

  return (
    <>
       
      <Hero data={heroSection} />
      {/* <Dummy /> */}
      {/* <InstructorsProfile /> */}
    </>
  );
} 
