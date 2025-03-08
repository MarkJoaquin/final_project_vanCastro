import { fetchPlans } from "@/api/contentful/fetchPlans"
 const PickAPlan = async () => {

    const plansData = await fetchPlans();

    return(
        <div className="sectionContainer">
            <h2>Pick What Fits You Best</h2>
        </div>
    )
}

export default PickAPlan;