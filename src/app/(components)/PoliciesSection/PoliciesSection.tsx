'use client'
import { useState , useEffect, use } from 'react';
import fetchPoliciesNFaq from '../../api/contentful/fetchPoliciesNFaqs';
import styles from './PoliciesSection.module.css'
import ItemCard from './ItemCard';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  

type PoliciesProps = {
    category: string;
    title: string;
    subtitle:string;
    content:string[]
}

const PoliciesSection = () => {
    
    const [policies, setPolicies] = useState<Record<string, PoliciesProps[]>>({});

    useEffect(()=>{
        const getPolicies = async () => {
            const data = await fetchPoliciesNFaq();

            if(data){
                const formattedData = data.map((policy:any) => ({
                    category:policy.fields.category,
                    title: policy.fields.title,
                    subtitle: policy.fields.subtitle,
                    content: policy.fields.content
                }))

                const groupedPolicies:  Record<string, PoliciesProps[]> = formattedData.reduce((acc, policy) => {
                    if (!acc[policy.title]) {
                        acc[policy.title] = [];
                    }
                    acc[policy.title].push(policy);
                    return acc;
                }, {} as Record<string, PoliciesProps[]>);

                setPolicies(groupedPolicies);
            } else {
                console.error('Error fetching policies: no data available')
            }
        }
        getPolicies();

    },[])

    return (
        <>
            <div id='policies' className={styles.policiesSection}>
                <div className={styles.header}>
                    <h2 className={styles.sectionTitle}>Policy</h2>
                    <p className={styles.sectionDescription}>The following policies apply to all services provided by VanCastro Driving School. Please review them carefully to understand your responsibilities and our commitments.</p>
                </div>
                <div className={styles.sectionContainer}>
                    <Accordion type="single" collapsible className={styles.accordionList}>
                        {Object.entries(policies).map(([title, groupedPolicies]:[string, PoliciesProps[]]) => (
                            <AccordionItem className={styles.mainAccordion} key={title} value={title}>
                                <AccordionTrigger className={styles.mainTrigger}>
                                    <p className={styles.accordionTitle}>{title}</p>
                                </AccordionTrigger>
                                <AccordionContent className={styles.subAccordion}>
                                    <Accordion type="multiple" className="w-full">
                                        {groupedPolicies.map((policy: PoliciesProps, index:number) => (
                                            <ItemCard key={`${policy.subtitle}-${index}`} data={policy} />
                                        ))}
                                    </Accordion>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </>
    )
}

export default PoliciesSection;