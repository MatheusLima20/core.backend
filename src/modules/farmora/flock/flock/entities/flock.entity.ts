import { FlockStatus } from "../enums/flock-status.enum";
import { FlockProps } from "./flock.props";

export class FlockEntity implements FlockProps {
    uid!: string;

    platformUID?: string;

    name!: string;

    quantity!: number;

    status!: FlockStatus;

    birthDate?: Date;

    arrivalDate?: Date;

    description?: string;

    createdBy?: string;
    updatedBy?: string;

    createdAt!: Date;
    updatedAt!: Date;

    constructor(props: FlockProps) {
        Object.assign(this, props);
    }
}
