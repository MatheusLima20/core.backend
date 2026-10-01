import { VaccinationStatus } from "../enums/vaccination.enum";

export interface VaccinationProps {
    uid?: string;

    platformUID?: string;

    flockUID: string;

    itemUID: string;

    applicationDate: Date;

    status: VaccinationStatus;

    dose?: string;

    batch?: string;

    nextDoseDate?: Date;

    notes?: string;

    createdBy?: string;
    updatedBy?: string;

    createdAt: Date;
    updatedAt: Date;
}
