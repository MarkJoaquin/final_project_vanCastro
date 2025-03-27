
export type PlanClass = {
    id: string;
    name: string;
    description: string;
    plans: Plan[];
}

export type Plan = {
    id: string;
    name: string;
    description: string;
    lessons: number;
    price: number;
    time: number;
}

export type FormData = {
    licenseClass: string;
    plan: string;
}