import { PlatformProps } from "./platform.props";

export class PlatformEntity implements PlatformProps {
    uid!: string;
    name!: string;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(props: PlatformEntity) {
        Object.assign(this, props);
    }
}
