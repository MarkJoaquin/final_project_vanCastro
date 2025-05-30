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
    // birthDate y country eliminados
    phone: string;
    email: string;
    
    // Información de licencia
    hasDriverLicense: 'yes' | 'no' | '';
    licenseNumber?: string;
    licenseType?: string;
    licenseExpiryDate?: Date | null;
    
    // Información de learner permit
    hasLearnerPermit: 'yes' | 'no' | '';
    learnerPermitImage?: any;
    learnerPermitUrl?: string;
    
    // Selección de lección
    licenseClass: string;
    plan: string;
    instructor: string;
    location: string;
    dateTime: Date | null;
    
    // Información de pago
    paymentMethod?: 'e-Transfer' | 'Pay in Cash' | '';
}