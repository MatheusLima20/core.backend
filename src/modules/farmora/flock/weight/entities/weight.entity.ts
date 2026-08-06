import { WeightProps } from "./weight.props";

export class WeightEntity implements WeightProps {
    uid!: string;

    platformUID?: string;

    flockUID!: string;

    weighingDate!: Date;

    averageWeight!: number;

    sampleSize?: number;

    notes?: string;

    createdBy?: string;
    updatedBy?: string;

    createdAt!: Date;
    updatedAt!: Date;

    constructor(props: WeightProps) {
        Object.assign(this, props);
    }
}
