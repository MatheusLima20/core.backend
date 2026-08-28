export interface FeedProps {
    uid?: string;

    platformUID: string;

    name: string;

    description?: string;

    createdBy?: string;
    updatedBy?: string;

    createdAt: Date;
    updatedAt: Date;
}
