import { PlatformCategory } from "../enum/platform.category-enum";

export interface PlatformProps {
    uid: string;
    name: string;
    slug: string;
    category: PlatformCategory;
    isActivated: boolean;
    createdBy: string | null;
    updatedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
}
