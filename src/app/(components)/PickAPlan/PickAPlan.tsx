'use client'
import { fetchPlans } from "@/app/api/contentful/fetchPlans"
import { useState, useEffect } from "react";
import {usePathname} from "next/navigation"
import Link from "next/link";
import SelectorBtn from "../Button/SelectorBtn";
import PlanCard from './PlanCard';
import styles from './PickAPlan.module.css';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"

type PlanProps = {
    category: string;
    title: string;
    planName: string;
    price: string,
    featuresList:string[],
    planId:string,
}

 const PickAPlan = () => {
    
    const btnNames = ['Class 7', 'Class 5', 'Class 4']
    const [selectedSection, setSelectedSection] = useState(btnNames[0]);
    const [plansData, setPlansData] = useState<PlanProps[]>([])
    const pathName = usePathname();

    useEffect(()=>{
        const getPlans = async () => {
            const data = await fetchPlans();
            if(data) {

                const formattedData = data.map((plan:any) =>({
                    category: plan.fields.category,
                    title: plan.fields.title,
                    planName: plan.fields.planName,
                    price: plan.fields.price,
                    featuresList: plan.fields.featuresList,
                    planId: plan.fields.planId
                }))

                setPlansData(formattedData)
            } else {
                console.error('Error fetching plans: no data')
            }
        }
        getPlans();
    },[])


    const filterPlans = plansData.filter(plan => plan.category === selectedSection)

    return(
        <div className={styles.sectionContainer}>
            <h2>Pick What Fits You Best</h2>
            <SelectorBtn btnName={btnNames} onSelect={setSelectedSection}/>
            <div className={styles.cardSectionContainer}>
                <Carousel key={selectedSection}>
                <ul className={styles.cardList}>
                    <CarouselContent>
                    {filterPlans.length > 0 ? (
                        filterPlans.map((plan:any) => {
                            return (
                                <CarouselItem className="sm:basis-1/1 md:basis-1/2 lg:basis-1/3" key={plan.planId}>
                                    <PlanCard data = {plan} />
                                </CarouselItem>
                            )
                        }
                    )):(
                        <p>No plans available for {selectedSection}</p>
                    )}
                    </CarouselContent>
                    <CarouselPrevious/>
                    <CarouselNext/> 
                </ul>
                </Carousel>
                
            </div>

            {pathName === '/' && (
                <div className={styles.buttonContainer}>
                    <Link href={'/plans'} className={styles.viewPlansBtn}>View Plans</Link>
                </div>
            )}
        </div>
    )
}

export default PickAPlan;