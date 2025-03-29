//"use client"

import { Button } from '@/components/ui/button';
import styles from '../LetUsKnow/LetUsKnow.module.css'; // Importing the CSS module
import Image from 'next/image';
import EditIcon from '@/../public/images/Admin/Edit_100_100.png'
import DeleteIcon from '@/../public/images/Admin/Delete_100_100.png'
import { useAdminDataContext } from '@/app/(context)/adminContext';

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
  
  const {allInstructorData} = useAdminDataContext();

  console.log("data in SSC:", allInstructorData);
  return (
    <div
      className={`${styles.formSection} w-full max-w-md space-y-2 rounded-lg p-6 lg:w-[25rem] h-[27rem] flex flex-col justify-around m-auto`} // Applying the new class
    >
      <h3 className='font-bold'>Instructor Information</h3>

      {allInstructorData?.map((item,index)=>{
        return <div key={index} className='flex justify-between items-center'>
          <h3 className='bg-white basis-2/3 pl-[1rem]'>{item.name}</h3>
          <div className='flex gap-1'>

{/*             <Image
              className='hover:cursor-pointer'
              src={EditIcon}
              alt='Edit'
              width={100}
              height={100}
              style={{width:"35px",height:"35px"}}
            />
            <Image
              className='hover:cursor-pointer'
              src={DeleteIcon}
              alt='Delete'
              width={100}
              height={100}
              style={{width:"35px",height:"35px"}}
            />
 */}          </div>
        </div>
      })}

      <Button
        className={`${styles.button} mt-[2rem]`} // Applying the new button styles
      >
        Click to Update
      </Button> 
    </div>
  );
}
