import { CreateContentDTO } from "../../../dtos/create-content.dto";
import { ContentType } from "../../../enums/content-type.enum";

export const dataContent1: CreateContentDTO = {
    title: "Node.js Fundamentals",
    description: "Learn Node.js",
    isPreview: false,
    lessonUID: "1",
    order: 2,
    type: ContentType.QUIZ,
};

export const dataContent2: CreateContentDTO = {
    title: "React.js Fundamentals",
    description: "Learn React.js",
    isPreview: false,
    lessonUID: "3",
    order: 1,
    type: ContentType.QUIZ,
};

export function makeContent(data?: Partial<CreateContentDTO>): CreateContentDTO {
    return {
        ...dataContent1,
        ...data,
    };
}
