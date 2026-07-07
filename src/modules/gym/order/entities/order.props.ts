
export interface OrderProps {
    uid: string;
    description: string;
    platformUID: string;
    createdBy: string;
    updatedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
}
