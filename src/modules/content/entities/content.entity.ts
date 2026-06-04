import { ContentType } from "../enum/content.enum";
import { ContentProps } from "./content.props";

export class ContentEntity implements ContentProps {
    uid!: string;
    userUID!: string | null;
    platformUID!: string;
    photo!: string | null;
    description!: string | null;
    amount!: number | null;
    value!: number | null;
    type!: ContentType;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(props: ContentProps) {
        Object.assign(this, props);
    }
}
