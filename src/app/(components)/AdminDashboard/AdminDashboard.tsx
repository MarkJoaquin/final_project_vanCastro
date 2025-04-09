"use client"

import AdminMainComponent from "./MainComponent/AdminMainComponent";

const Main = ["One","Two","Three","Four","Five"];
const Sub = ["one","two","three","four","five"];
const Date = ["Mar 1","Mar 2", "Mar 3", "Mar 4", "Mar 5"]
const WhenStartLesson = ["In 24 hours","In 24 hours", "In 24 hours", "In 48 hours", "In 48 hours"]
const Payment = [100,200,300,400,500]


export default function Dashboard() {

  return (
    <div className="min-h-[70vh]">
      This is Dashboard

      {/*// This is How to Pass data into this Component

      <AdminMainComponent Maincontents={Main} SubItems={Sub}/>
      <AdminMainComponent Maincontents={Main} SubItems={Sub} AcceptBtn={true}/>
      <AdminMainComponent Maincontents={Main} SubItems={Sub} Date={Date}/>
      <AdminMainComponent Maincontents={Main} SubItems={Sub} WhenStartLesson={WhenStartLesson}/>
      <AdminMainComponent Maincontents={Main} SubItems={Sub} Payment={Payment}/>

      */}

    </div>
  );
}
