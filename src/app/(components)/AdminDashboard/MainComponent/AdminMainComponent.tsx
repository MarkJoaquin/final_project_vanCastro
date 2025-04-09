import { Button } from "@/components/ui/button";
import Style from "./AdminMainComponent.module.css"

interface MainComponent {
//Left items
  Maincontents:string[];
  SubItems:string[];
//Right items
  AcceptBtn?:boolean
  Date?:string[];
  WhenStartLesson?:string[];
  Payment?:number[];
}

export default function AdminMainComponent({Maincontents,SubItems,AcceptBtn,Date,WhenStartLesson,Payment}:MainComponent) {

  return (
    <div className="w-[80%] m-auto">
      {Maincontents.map((item,index)=><div key={index} className={`flex justify-between items-center border-b-1 border-gray-400 ${Style.leftItems} py-[1rem]`}>
        <div className="min-w-[50%]">
          <h2 className="text-xl font-bold leading-none">{item}</h2>
          <p className="text-sm leading-none">{SubItems[index]}</p>
        </div>
        <div className={`ml-auto`}>
          {AcceptBtn &&
            <div className={`flex gap-[1rem]`}>
              <Button type="submit" className={`w-[fit] text-black bg-[#FFCE47]`}>
                Accept
              </Button>
              <Button type="submit" className={`w-[fit] text-black bg-white border-1 border-black`}>
                Decline
              </Button>
            </div>
          }
          {Date && 
            <p className="text-sm">{Date[index]}</p>
          }
          {WhenStartLesson && 
            <p className="text-sm">{WhenStartLesson[index]}</p>
          }
          {Payment && 
            <p className="text-sm">${Payment[index]}</p>
          }
        </div>
      </div>)}
    </div>
  );
}
