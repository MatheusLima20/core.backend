import { FeedProps } from "./feed.props";

export class FeedEntity implements FeedProps {
    uid!: string;

    platformUID!: string;

    name!: string;

    description?: string;

    createdBy?: string;
    updatedBy?: string;

    createdAt!: Date;
    updatedAt!: Date;

    constructor(props: FeedProps) {
        Object.assign(this, props);
    }
}
