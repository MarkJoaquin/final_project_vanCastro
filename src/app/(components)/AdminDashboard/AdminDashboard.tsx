"use client"
import AdminTemplate from "./Template/AdminTemplate";

const Main = ["One","Two","Three","Four","Five"];
const Sub = ["one","two","three","four","five"];
const Date = ["Mar 1","Mar 2", "Mar 3", "Mar 4", "Mar 5"]
const WhenStartLesson = ["In 24 hours","In 24 hours", "In 24 hours", "In 48 hours", "In 48 hours"]
const Payment = [100,200,300,400,500]


export default function Dashboard() {

  return (
    <div className="min-h-[70vh]">
      This is Dashboard

      {/*// This is How to Pass data into this Component*/}

      <AdminTemplate PageTitle={"Booking Requests"} SearchBar={true} Component={{Maincontents:Main, SubItems:Sub,AcceptBtn:true
      }}/>
      <AdminTemplate PageTitle={"Student List"} SearchBar={true} Component={{Maincontents:Main, SubItems:Sub, Date:Date}}/>
      <AdminTemplate PageTitle={"Pending Action"} SearchBar={false} Component={{Maincontents:Main, SubItems:Sub, WhenStartLesson:WhenStartLesson}}/>
      <AdminTemplate PageTitle={"Lesson List"} SearchBar={true} AddNewBtn={true} PeriodBtn={true} Component={{Maincontents:Main, SubItems:Sub}}/>
      <AdminTemplate PageTitle={"Payment List"} SearchBar={true} AddNewBtn={true} Component={{Maincontents:Main, SubItems:Sub, Payment:Payment}}/>
      <AdminTemplate PageTitle={"Invoice List"} SearchBar={true} AddNewBtn={true} Component={{Maincontents:Main, SubItems:Sub, Date:Date}}/>
      <AdminTemplate PageTitle={"Contact List"} SearchBar={true} AddNewBtn={true} Component={{Maincontents:Main, SubItems:Sub, Date:Date}}/>

    </div>
  );
}
