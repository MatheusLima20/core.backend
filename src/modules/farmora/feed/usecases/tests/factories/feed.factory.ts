import { CreateFeedDTO } from "../../../dtos/create-feed.dto";

export const feed1: CreateFeedDTO = {
    name: "Posture Feed",
    description: "Feed formulation for laying hens.",

    items: [],
};

export const feed2: CreateFeedDTO = {
    name: "Growth Feed",
    description: "Feed formulation for growing chickens.",

    items: [],
};

export function makeFeed(data?: Partial<CreateFeedDTO>): CreateFeedDTO {
    return {
        ...feed1,
        ...data,
    };
}
