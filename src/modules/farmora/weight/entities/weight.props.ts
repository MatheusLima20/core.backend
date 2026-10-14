export interface WeightProps {
    uid?: string;

    platformUID?: string;

    flockUID: string;

    breedUID: string;

    weighingDate: Date;

    averageWeight: number;

    sampleSize?: number;

    notes?: string;

    createdBy?: string;
    updatedBy?: string;

    createdAt: Date;
    updatedAt: Date;
}
