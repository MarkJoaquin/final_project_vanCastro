'use client'
import { fetchPlans } from "@/api/contentful/fetchPlans"
import { useState, useEffect } from "react";
import SelectorBtn from "../Button/SelectorBtn";
import PlanCard from './PlanCard';
import styles from './PickAPlan.module.css';

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
        <div className="sectionContainer">
            <h2>Pick What Fits You Best</h2>
            <SelectorBtn btnName={btnNames} onSelect={setSelectedSection}/>
            <div className="cardSectionContainer">
                <ul>
                    {filterPlans.length > 0 ? (
                        filterPlans.map((plan:any) => {
                            return <PlanCard data = {plan} key={plan.planId}/>
                        }
                    )):(
                        <p>No plans available for {selectedSection}</p>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default PickAPlan;