import { VaccinationProps } from "./vaccination.props";

export class VaccinationEntity implements VaccinationProps {
    uid!: string;

    platformUID?: string;

    flockUID!: string;

    vaccineName!: string;

    applicationDate!: Date;

    dose?: string;

    manufacturer?: string;

    batch?: string;

    nextDoseDate?: Date;

    notes?: string;

    createdBy?: string;
    updatedBy?: string;

    createdAt!: Date;
    updatedAt!: Date;

    constructor(props: VaccinationProps) {
        Object.assign(this, props);
    }
}
