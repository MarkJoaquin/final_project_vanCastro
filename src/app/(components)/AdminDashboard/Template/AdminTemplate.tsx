import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminMainComponent, { MainComponent } from "../MainComponent/AdminMainComponent";

interface TemplateProps {
  PageTitle:string;
  SearchBar?:boolean;
  Component: MainComponent
}

export default function AdminTemplate({PageTitle, SearchBar=false, Component}:TemplateProps) {

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
{/*       <div>
        <Button className={`w-[fit] text-white bg-black rounded-[50%]`}>
          + Add New Lesson
        </Button>
      </div> */}
      <div>
        <AdminMainComponent data={Component}/>
      </div>
    </div>
  );
}
