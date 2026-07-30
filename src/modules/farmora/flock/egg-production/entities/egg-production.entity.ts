import { EggProductionProps } from "./egg-production.props";

export class EggProductionEntity implements EggProductionProps {
    uid!: string;

    platformUID?: string;

    flockUID!: string;

    productionDate!: Date;

    totalEggs!: number;

    crackedEggs?: number;

    dirtyEggs?: number;

    discardedEggs?: number;

    notes?: string;

    createdBy?: string;
    updatedBy?: string;

    createdAt!: Date;
    updatedAt!: Date;

    constructor(props: EggProductionProps) {
        Object.assign(this, props);
    }
}
