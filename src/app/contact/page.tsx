import AboutVancastro from "../(components)/AboutVancastro/AboutVancastro";
import OurCoach from "../(components)/OurCoach/OurCoach";

export default function Contact() {
    const aboutVancastro = {
        title: "About VanCastro Driving School",
        subtitle: "Your trusted partner in driving education since 2020. We're committed to creating safe and confident drivers.",
    }

    return (
        <>
            <AboutVancastro data={aboutVancastro} />
            <OurCoach/>
        </>
    );
}