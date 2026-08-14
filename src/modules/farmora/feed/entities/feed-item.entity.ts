import { FeedItemProps } from "./feed-item.props";

export class FeedItemEntity implements FeedItemProps {
    uid!: string;

    feedUID!: string;

    inventoryItemUID!: string;

    inclusionPercentage!: number;

    constructor(props: FeedItemProps) {
        Object.assign(this, props);
    }
}
