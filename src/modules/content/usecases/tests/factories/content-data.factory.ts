import { CreateContentDTO } from "../../../dtos/create-content.dto";
import { ContentType } from "../../../enums/content.type";

export const dataContent1: CreateContentDTO = {
    type: ContentType.IMAGE,
    url: "https://example.com/image-1.jpg",
    alt: "Product image",
    name: "product-image-1",
    mimeType: "image/jpeg",
    size: 102400,
};

export const dataContent2: CreateContentDTO = {
    type: ContentType.IMAGE,
    url: "https://example.com/image-2.jpg",
    alt: "Product image",
    name: "product-image-2",
    mimeType: "image/jpeg",
    size: 204800,
};

export function makeContent(data?: Partial<CreateContentDTO>): CreateContentDTO {
    return {
        ...dataContent1,
        ...data,
    };
}
