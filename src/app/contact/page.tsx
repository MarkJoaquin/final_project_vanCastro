import AboutVancastro from "../(components)/AboutVancastro/AboutVancastro";
<<<<<<< HEAD
import LetUsKnow from "../(components)/LetUsKnow/LetUsKnow";


=======
import OurStory from "../(components)/OurStory/OurStory";
import NeedHelpICBC from "../(components)/NeedHelpICBC/NeedHelpICBC";
import callImg from "@/../public/images/NeedHelpICBC/call.png"
import facebookImg from "@/../public/images/NeedHelpICBC/FacebookImg.png"
import instagramImg from "@/../public/images/NeedHelpICBC/InstagramImg.png"
>>>>>>> d30a3b8f22ae264fd4cfcf4ab7a3d0d407961949

export default function Contact() {
    const aboutVancastro = {
        title: "About VanCastro Driving School",
        subtitle: "Your trusted partner in driving education since 2020. We're committed to creating safe and confident drivers.",
    }

    const NeedHelpICBCdata = {
            title1:"Need help with the",
            title2:"ICBC Knowledge Test?",
            subTitle:`Connect with Our Partner!`,
            cardInfo:{
                phoneIcon:callImg,
                phoneNumber:"+1 (236)-513-2741",
                email:"icbcknowledgetestmaterial@gmail.com",
                socialMediaIcon:[facebookImg,instagramImg],
                socialMediaLink:["https://www.facebook.com/ICBCKnowledgeTestMaterial/","https://www.instagram.com/digicraft.designs/"]
            },
        }
    
    return (
        <>
            <AboutVancastro data={aboutVancastro} />
<<<<<<< HEAD
            <LetUsKnow color={"bg-zinc-900"}/>
=======
            <OurStory />
            <NeedHelpICBC data={NeedHelpICBCdata}/>

>>>>>>> d30a3b8f22ae264fd4cfcf4ab7a3d0d407961949
        </>
    );
}
