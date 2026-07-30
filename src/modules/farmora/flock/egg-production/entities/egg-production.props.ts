export interface EggProductionProps {
    uid: string;

    platformUID?: string;

    flockUID: string;

    productionDate: Date;

    totalEggs: number;

    crackedEggs?: number;

    dirtyEggs?: number;

    discardedEggs?: number;

    notes?: string;

    createdBy?: string;
    updatedBy?: string;

    createdAt: Date;
    updatedAt: Date;
}
