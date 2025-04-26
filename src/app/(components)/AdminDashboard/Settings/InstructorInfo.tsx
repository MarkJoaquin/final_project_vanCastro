
type Props = {
  title: string;
  item: string|number;
  haveMB?: boolean;
};

export default function SettingInstructorPlate({ title , item , haveMB=true}:Props) {
  const mb = haveMB ? "mb-[0.5rem]":"";

  return (
    <>
      <div className={`flex flex-wrap ${mb}`}>
        <p className='min-w-[110px] basis-1/3'>{title} :</p>
        <p className='min-w-[180px] ml-[1rem] font-bold'> {item}</p>
      </div>
    </>
  );
}