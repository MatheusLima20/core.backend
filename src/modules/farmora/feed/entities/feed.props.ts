export interface FeedProps {
    uid?: string;

    platformUID: string;

    flockUID: string;

    name: string;

    description?: string;

    createdBy?: string;
    updatedBy?: string;

    createdAt: Date;
    updatedAt: Date;
}
