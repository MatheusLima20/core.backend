import { ContentType } from "../enum/content.enum";

export interface ContentProps {
    uid: string;
    userUID: string | null;
    photo: string | null;
    description: string | null;
    amount: number | null;
    value: number | null;
    platformUID: string;
    type: ContentType;
    createdAt: Date;
    updatedAt: Date;
}
