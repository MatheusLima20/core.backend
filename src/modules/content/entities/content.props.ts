import { ContentType } from "../enums/content.type";

export interface ContentProps {
    uid?: string;
    platformUID: string;
    type: ContentType;
    url: string;
    alt?: string | null;
    name: string;
    mimeType?: string | null;
    size?: number | null;
    createdBy?: string;
    updatedBy?: string | null;
    createdAt: Date;
    updatedAt?: Date;
}
