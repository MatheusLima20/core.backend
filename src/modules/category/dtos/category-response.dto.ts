import { CategoryEntity } from "../entities/category.entity";

export type CategoryResponseDTO = Pick<
    CategoryEntity,
    | "uid"
    | "platformUID"
    | "name"
    | "description"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
