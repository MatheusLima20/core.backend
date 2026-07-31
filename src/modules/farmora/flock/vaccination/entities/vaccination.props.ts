export interface VaccinationProps {
    uid: string;

    platformUID?: string;

    flockUID: string;

    vaccineName: string;

    applicationDate: Date;

    dose?: string;

    manufacturer?: string;

    batch?: string;

    nextDoseDate?: Date;

    notes?: string;

    createdBy?: string;
    updatedBy?: string;

    createdAt: Date;
    updatedAt: Date;
}
