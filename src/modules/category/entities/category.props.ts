export interface CategoryProps {
    uid?: string;

    platformUID: string;

    name: string;

    description?: string | null;

    createdBy?: string;

    updatedBy?: string | null;

    createdAt: Date;

    updatedAt?: Date;
}
