export interface PlatformProps {
    uid: string;
    name: string;
    slug: string;
    isActivated: boolean;
    createdBy: string | null;
    updatedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
}
