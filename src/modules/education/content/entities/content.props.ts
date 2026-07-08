import { ContentType } from "../enums/content-type.enum";

export interface ContentProps {
    uid: string;
    platformUID: string;

    lessonUID: string;

    title: string;
    description: string;

    type: ContentType;

    order: number;

    isPreview: boolean;

    createdBy: string;
    updatedBy: string | null;

    createdAt: Date;
    updatedAt: Date;
}
