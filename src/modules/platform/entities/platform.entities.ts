import { PlatformCategory } from "../enum/platform.category-enum";
import { PlatformProps } from "./platform.props";

export class PlatformEntity implements PlatformProps {
    uid!: string;
    name!: string;
    slug!: string;
    category!: PlatformCategory;
    isActivated!: boolean;
    createdBy!: string | null;
    updatedBy!: string | null;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(props: PlatformEntity) {
        Object.assign(this, props);
    }
}
