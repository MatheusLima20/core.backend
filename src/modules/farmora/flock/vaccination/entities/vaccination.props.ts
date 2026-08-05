export interface VaccinationProps {
    uid: string;

    platformUID?: string;

    flockUID: string;

    itemUID: string;

    applicationDate: Date;

    dose?: string;

    batch?: string;

    nextDoseDate?: Date;

    notes?: string;

    createdBy?: string;
    updatedBy?: string;

    createdAt: Date;
    updatedAt: Date;
}
