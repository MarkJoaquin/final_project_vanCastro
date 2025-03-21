import AboutVancastro from "../(components)/AboutVancastro/AboutVancastro";
import LetUsKnow from "../(components)/LetUsKnow/LetUsKnow";



export default function Contact() {
    const aboutVancastro = {
        title: "About VanCastro Driving School",
        subtitle: "Your trusted partner in driving education since 2020. We're committed to creating safe and confident drivers.",
    }

    return (
        <>
            <AboutVancastro data={aboutVancastro} />
            <LetUsKnow color={"bg-zinc-900"}/>
        </>
    );
}