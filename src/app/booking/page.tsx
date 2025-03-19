import NeedHelpICBC from "../(components)/NeedHelpICBC/NeedHelpICBC";

const NeedHelpICBCdata = [
    {
        title1:"Need help with the",
        title2:"ICBC Knowledge Test?",
        subTitle:`Connect with Our Partner!`,
        cardInfo:[
            {
                phoneIcon:"",
                phoneNumber:"+1 (236)-513-2741",
                email:"icbcknowledgetestmaterial@gmail.com",
                socialMediaIcon:["",""]
            }
        ],
    }
]

export default function Booking() {
    return (
        <div className="min-h-[300px] pt-[300px]">
            <h1>This is the booking page</h1>
            <NeedHelpICBC/>
        </div>
    )
}