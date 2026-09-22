import { CategoryEntity } from "../entities/category.entity";

export type CreateCategoryDTO = Pick<CategoryEntity, "name" | "description">;

export type CreateCategoryResponseDTO = Pick<
    CategoryEntity,
    "uid" | "name" | "description" | "createdAt" | "createdBy"
>;
