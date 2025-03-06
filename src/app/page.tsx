import ReviewCarousel from "./(components)/carousel/ReviewCarousel";
import YoutubeCarousel from "./(components)/carousel/YoutubeCarousel";
import Dummy from "./(components)/Dummy/Dummy";
import Hero from "./(components)/hero/Hero";

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
  return (
    <>
      <Hero data={heroSection} />
      <Dummy />
      <ReviewCarousel/>
      <YoutubeCarousel/>
    </>
  );
}
