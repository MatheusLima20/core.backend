export interface WeightProps {
    uid?: string;

    platformUID?: string;

    flockUID: string;

    weighingDate: Date;

    averageWeight: number;

    sampleSize?: number;

    notes?: string;

    createdBy?: string;
    updatedBy?: string;

    createdAt: Date;
    updatedAt: Date;
}
