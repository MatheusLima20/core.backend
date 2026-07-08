import { ContentType } from "../enums/content-type.enum";
import { ContentProps } from "./content.props";

export class ContentEntity implements ContentProps {
    uid!: string;
    platformUID!: string;
    lessonUID!: string;
    title!: string;
    description!: string;
    type!: ContentType;
    order!: number;
    isPreview!: boolean;
    createdBy!: string;
    updatedBy!: string | null;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(props: ContentEntity) {
        Object.assign(this, props);
    }
}
