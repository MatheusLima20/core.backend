import { CreateCategoryDTO } from "../../../dtos/create-category.dto";

export const dataCategory1: CreateCategoryDTO = {
    name: "Category 1",
    description: "Category description 1",
};

export const dataCategory2: CreateCategoryDTO = {
    name: "Category 2",
    description: "Category description 2",
};

export function makeCategory(data?: Partial<CreateCategoryDTO>): CreateCategoryDTO {
    return {
        ...dataCategory1,
        ...data,
    };
}
