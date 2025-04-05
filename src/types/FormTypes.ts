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

export type Location = {
    id: string;
    name: string;
    address: string;
    city: string;
    zip: string;
}

export type FormData = {
    // Datos personales
    firstName: string;
    lastName: string;
    birthDate: Date | null;
    country: string;
    phone: string;
    email: string;
    
    // Información de licencia
    hasDriverLicense: 'yes' | 'no' | '';
    licenseNumber?: string;
    licenseType?: string;
    licenseExpiryDate?: Date | null;
    
    // Información de road test
    hasBookedRoadTest: 'yes' | 'no' | '';
    roadTestLocation?: string;
    
    // Selección de lección
    licenseClass: string;
    plan: string;
    instructor: string;
    location: string;
    dateTime: Date | null;
}