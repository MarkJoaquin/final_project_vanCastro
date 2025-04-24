//"use client"

import { Button } from '@/components/ui/button';
import styles from '../LetUsKnow/LetUsKnow.module.css'; // Importing the CSS module
import { useAdminDataContext } from '@/app/(context)/adminContext';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import SettingInstructorPlate from './Settings/InstructorInfo';
import { title } from 'process';

export interface Instructor {
  id: string;
  name: string;
  languages: string[];
  phone: string;
  email: string;
  password: string;
  licenseNumber?: string;
  experienceYears?: number;
  createdAt: string;
  updatedAt: string;
}

export interface InstructorProps {
  instructorData:Instructor[]|null;
  isEdit:boolean;
}

export default function AdminSetting() {
  const [instructorInfo,setInstrcutorInfo] = useState<Instructor|null>(null);
  const { loginedInstructorData } = useAdminDataContext(); 

  const [newInstructorInfo,setNewInstructorInfo] = useState({
    id:"",
    name:"",
    languages:[] as string[],
    phone:"",
    email:"",
    licenseNumber:"",
    experience:0,
    currentPassword:"",
    newPassword:"",
    newPassConfirm:"",
  })
  const [editPass,setEditPass] = useState(false);
  const [isPassNotFilled,setIsPassNotFilled] = useState<string>("");
  const [currentPassError,setCurrentPassError] = useState(false);
  const [newPassError,setNewPassError] = useState<string|null>(null);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
          const res = await fetch(`/api/instructors/${loginedInstructorData?.id}`);
          if (!res.ok) throw new Error("Error fetching Instructor");
          const data = await res.json();

          setInstrcutorInfo(data.data);
      } catch (error) {
          console.error("Error fetching booking requests:", error);
      }
    };

    if (loginedInstructorData) {
      fetchInstructor(); 
    }
  }, [loginedInstructorData]);

  useEffect(()=>{
    if(instructorInfo){
      setNewInstructorInfo({
        id:instructorInfo.id,
        name:instructorInfo.name,
        languages:instructorInfo.languages,
        phone:instructorInfo.phone,
        email:instructorInfo.email,
        licenseNumber:instructorInfo.licenseNumber || "",
        experience: instructorInfo.experienceYears || 0,
        currentPassword:"",
        newPassword:"",
        newPassConfirm:"",
      })
    }
  },[instructorInfo])

  const editPassHandler = () => {
    const value = editPass === true ? false : true;
    setEditPass(value)
  }

  const changePasswordHandler = async () => {
    setCurrentPassError(false);
    if(!newInstructorInfo.currentPassword || !newInstructorInfo.newPassword || !newInstructorInfo.newPassConfirm){
      setIsPassNotFilled("please input all information")
      return
    } 
    setIsPassNotFilled("")

    if(newInstructorInfo.newPassword.length < 8){
      setNewPassError("password should be over 8 charactors")
      return
    }

    if(newInstructorInfo.newPassword !== newInstructorInfo.newPassConfirm){
      setNewPassError("please input the same new password")
      setNewInstructorInfo({...newInstructorInfo,newPassword:"", newPassConfirm:""})
      return
    }

    setNewPassError(null);

    try {
      const res = await fetch(`/api/instructors/${newInstructorInfo.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...newInstructorInfo}),
      });

      const data = await res.json();
      if (!res.ok){
        setCurrentPassError(true);
        setNewInstructorInfo({...newInstructorInfo, currentPassword:"" ,newPassword:"", newPassConfirm:""})
        return;
      };

      alert("Your password was renewed!!")
      setNewInstructorInfo({...newInstructorInfo, currentPassword:"" ,newPassword:"", newPassConfirm:""})
      setCurrentPassError(false);
      setEditPass(false);
      setNewPassError(null);

    } catch (error) {
        console.error("Error fetching booking requests:", error);
    }

  }

  return (
    <>
      {instructorInfo && 
        <>
          <Card className="mb-4 w-full max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Instructor</CardTitle>
            </CardHeader>
            <div className='w-full flex flex-col gap-[1rem]'>
              <div className='px-[1rem]'>
                <SettingInstructorPlate title="Name" item={newInstructorInfo.name}/>
                <SettingInstructorPlate title="Language" item={newInstructorInfo.languages.join(", ")}/>
                <SettingInstructorPlate title="Phone" item={newInstructorInfo.phone}/>
                <SettingInstructorPlate title="Email" item={newInstructorInfo.email}/>
                <SettingInstructorPlate title="License" item={newInstructorInfo.licenseNumber}/>
                <SettingInstructorPlate title="Experience" item={newInstructorInfo.experience} haveMB={false}/>
              </div>
            </div>

            <div className='w-[90%] m-auto flex justify-center sm:justify-end'>
              <Button onClick={editPassHandler}
                className={`w-full sm:w-auto bg-[var(--primary-color)] text-black font-bold hover:text-white cursor-pointer`} 
              >
                Change Password
              </Button> 
            </div>

          </Card>

          {editPass &&
            <>
              <div className='border-1 border-black rounded-md'>
                <div className='px-[1rem] py-[0.5rem] bg-[#FFCE47] border-dashed border-b-1 border-black rounded-t-md'>
                  <p className='font-bold'>Change the Password</p>
                  {isPassNotFilled.length > 0 && 
                    <p className='text-red-500 pb-[0.5rem] text-sm'>*{isPassNotFilled}</p>
                  }
                </div>
                <div className='w-full border-b-1 border-gray-400 border-dashed'>
                  <input className='mx-[1rem] my-[0.5rem] px-[1rem] rounded-sm border-1 border-gray-500 bg-[#EDEDED]' type="password" placeholder='Current Password' value={newInstructorInfo.currentPassword} onChange={(e) => setNewInstructorInfo({ ...newInstructorInfo, currentPassword: e.target.value })}/>
                  {currentPassError && 
                    <p className='mx-[1rem] text-red-500 pb-[0.5rem] text-sm'>*Input correct password</p>
                  }
                </div>
                <div className='flex flex-col'>
                  <div>
                    <input className='mx-[1rem] my-[0.5rem] px-[1rem] rounded-sm border-1 border-gray-500 bg-[#EDEDED]' type="password" placeholder='New Password' value={newInstructorInfo.newPassword} onChange={(e) => setNewInstructorInfo({ ...newInstructorInfo, newPassword: e.target.value })}/>
                    <input className='mx-[1rem] my-[0.5rem] px-[1rem] rounded-sm border-1 border-gray-500 bg-[#EDEDED]' type="password" placeholder='New Password Confirmation' minLength={8} value={newInstructorInfo.newPassConfirm} onChange={(e) => setNewInstructorInfo({ ...newInstructorInfo, newPassConfirm: e.target.value })}/>
                  </div>
                  {newPassError && 
                    <p className='mx-[1rem] text-red-500 pb-[0.5rem] text-sm'>*{newPassError}</p>
                  }
                </div>
              </div>      

              <div className='w-[50%] m-auto min-w-[150px]'>
                <Button
                  className={`${styles.button} mt-[0.5rem]`} onClick={changePasswordHandler}
                >
                  Click to Change
                </Button> 
              </div>
            </>
          }
        </>
      }
    </>
  );
}
