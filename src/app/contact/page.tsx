import AboutVancastro from "../(components)/AboutVancastro/AboutVancastro";
import NeedHelpICBC from "../(components)/NeedHelpICBC/NeedHelpICBC";
import sampleImg from "@/../public/images/yellowFacebook.png"

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
                phoneIcon:sampleImg,
                phoneNumber:"+1 (236)-513-2741",
                email:"icbcknowledgetestmaterial@gmail.com",
                socialMediaIcon:[sampleImg,sampleImg]
            },
        }
    
    return (
        <>
            <AboutVancastro data={aboutVancastro} />
            <NeedHelpICBC data={NeedHelpICBCdata}/>

        </>
    );
}
