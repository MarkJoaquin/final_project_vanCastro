import Dummy from "./(components)/Dummy/Dummy";
import Hero from "./(components)/hero/Hero";
import Navbar from "./(components)/navbar /Navbar";
import Steps from "./(components)/steps/Steps";

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

  

  const steps = [
    {
      name: "Step", 
      id: "1",
      title: "Take the Knowledge Test",
      mainText: [
        "Prepare for and complete the Knowledge Test to assess your understanding of driving rules"
      ],
      subText: "Need translation? Click here to connect with a partner for language support",
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
      <Navbar/>
      <Hero data={heroSection} />
      <Steps data={stepsOneSection} />
      <Steps data={stepsTwoSection} />
      <Steps data={stepsThreeSection} />
    </>
  );
}
