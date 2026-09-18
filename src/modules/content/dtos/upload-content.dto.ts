import { ContentType } from "../enums/content.type";

export interface UploadContentDTO {
    filepath: string;
    originalFilename: string;
    mimeType: string;
    size: number;
    type: ContentType;
}
