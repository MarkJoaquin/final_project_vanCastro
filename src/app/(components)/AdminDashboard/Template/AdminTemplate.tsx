import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminMainComponent, { MainComponent } from "../MainComponent/AdminMainComponent";

interface TemplateProps {
  PageTitle:string;
  SearchBar?:boolean;
  AddNewBtn?:boolean;
  PeriodBtn?:boolean;
  Component: MainComponent
}

export default function AdminTemplate({PageTitle, SearchBar=false, AddNewBtn=false,PeriodBtn=false , Component}:TemplateProps) {

  return (
    <div className="w-[80%] m-auto mt-[2rem]">
      <div className="flex justify-between items-center flex-wrap gap-[0.5rem]">
        <h2 className="text-2xl font-bold">{PageTitle}</h2>
        {SearchBar && 
          <div className="flex gap-[1rem]">
            <Input
              placeholder="Search by Student name"
              type="text"
    /*           value={formData.phone} */
    /*           onChange={(e) => setFormData({ ...formData, phone: e.target.value })} */
              className="bg-white py-5"
              required
            />
            <Button className={`w-[fit] text-black bg-white border-1 border-black`}>
              Filter
            </Button>
          </div>
        }
      </div>

      <div className="flex gap-[0.5rem] mt-[0.5rem]">
        {PeriodBtn && 
        <div className="flex gap-[0.5rem]">
          <Button className={`w-[fit] text-black bg-white border-1 border-black rounded-[20px]`}>
            Daily
          </Button>
          <Button className={`w-[fit] text-black bg-white border-1 border-black rounded-[20px]`}>
            Monthly
          </Button>
        </div>
      
        }

        {AddNewBtn &&
          <div>
            <Button className={`w-[fit] text-white bg-black rounded-[20px]`}>
              + Add New Lesson
            </Button>
          </div>
        }
      </div>

      <div>
        <AdminMainComponent data={Component}/>
      </div>
    </div>
  );
}
