import { FlockStatus } from "../enums/flock-status.enum";

export interface FlockProps {
    uid?: string;

    platformUID?: string;

    name: string;

    quantity: number;

    status: FlockStatus;

    birthDate?: Date;

    arrivalDate?: Date;

    description?: string;

    createdBy?: string;
    updatedBy?: string;

    createdAt: Date;
    updatedAt: Date;
}
