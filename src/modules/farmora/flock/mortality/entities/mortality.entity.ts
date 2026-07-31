import { MortalityCause } from "../enums/mortality-cause.enum";
import { MortalityProps } from "./mortality.props";

export class MortalityEntity implements MortalityProps {
    uid!: string;

    platformUID?: string;

    flockUID!: string;

    mortalityDate!: Date;

    quantity!: number;

    cause?: MortalityCause;

    notes?: string;

    createdBy?: string;
    updatedBy?: string;

    createdAt!: Date;
    updatedAt!: Date;

    constructor(props: MortalityProps) {
        Object.assign(this, props);
    }
}
