import Hero from "../(components)/hero/Hero";
import HereToHelp from "../(components)/HereToHelp/HereToHelp";
import PickAPlan from "../(components)/PickAPlan/PickAPlan";
import ContactSection from "../(components)/ContactSection/Contact_Us";
import hereToHelpImg from "@/../public/images/HereToHelp/here-to-help-icon.svg"
import Person1Img from "@/../public/images/ICBC_knowledge/Person1.png"
import Person2Img from "@/../public/images/ICBC_knowledge/Person2.png"
import ICBCKnowledge from "../(components)/ICBCKnowledge/ICBCKnowledge";

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
    title1: ["We're Here to Help"],
    title2: ["Let's Customize Your Driving Plan!"],
    subtitle: ["Our courses are designed to fit the experience and ability level of each individual learner."],
    title1Color: ["#000000"],
    title2Color: ["#000000"],
    subtitleColor: ["#000000"],
    img1:hereToHelpImg,
    buttonText: "Contact Us",
    linkTo: "contact",
    bgColor: "#FFCE47",
    btnColor: "#2F2F2F",
    btnTextColor: "#FFF5D8",
    type:"style1"
  }  

  const ICBC_knowledge = {
    title1: ["Taking the ICBC", "Knowledge Test"],
    title2: ["Let's Customize Your Driving Plan!"],
    subtitle: ["Check out", " our partner for"],
    title1Color: ["#000000","#FFAE00"],
    title2Color: ["#000000"],
    subtitleColor: ["#FFAE00","#000000"],
    img1:Person1Img,
    img2:Person2Img,
    buttonText: "Contact Us",
    linkTo: "contact",
    bgColor: "#F7F7F7",
    btnColor: "#FFCE47",
    btnTextColor: "#000000",
    type:"style2"
  }  

  return (
    <>
      <Hero data={heroSection} />
      <PickAPlan/>
      <ICBCKnowledge data={ICBC_knowledge}/>
      {/* instructors */}
      <HereToHelp data={hereToHelp} />
      <ContactSection />
    </>
  );
} 
