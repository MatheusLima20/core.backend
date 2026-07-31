import { MortalityCause } from "../enums/mortality-cause.enum";

export interface MortalityProps {
    uid: string;

    platformUID?: string;

    flockUID: string;

    mortalityDate: Date;

    quantity: number;

    cause?: MortalityCause;

    notes?: string;

    createdBy?: string;
    updatedBy?: string;

    createdAt: Date;
    updatedAt: Date;
}
