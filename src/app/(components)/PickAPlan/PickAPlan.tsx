'use client'
import { fetchPlans } from "@/api/contentful/fetchPlans"
import { useState, useEffect } from "react";
import SelectorBtn from "../Button/SelectorBtn";
import PlanCard from './PlanCard';
 const PickAPlan = () => {

    // const plansData = await fetchPlans();
    // // console.log('Plans: ', plansData)
    const btnNames = ['Class 7', 'Class 5', 'Class 4']
    const [selectedSection, setSelectedSection] = useState(btnNames[0]);
    const [plansData, setPlansData] = useState<any>('')

    useEffect(()=>{
        const getPlans = async () => {
            const data = await fetchPlans();
            if(data) {
                setPlansData(data)
            } else {
                console.error('Error fetching plans: no data')
            }
        }
        getPlans();
    },[])

    // console.log('Plans: ', plansData)

    return(
        <div className="sectionContainer">
            <h2>Pick What Fits You Best</h2>
            <SelectorBtn btnName={btnNames} onSelect={setSelectedSection}/>
            <div className="cardSectionContainer">
                <ul>
                    {plansData && plansData.length > 0 && plansData.map((plan) => {

                        const planData = {
                            category: plan.fields.category,
                            title: plan.fields.title,
                            planName: plan.fields.planName,
                            price: plan.fields.price,
                            featuresList: plan.fields.featuresList,
                        };

                        return <PlanCard data = {planData}/>
                    }
                        
                    )}
                </ul>
            </div>
            
        </div>
    )
}

export default PickAPlan;