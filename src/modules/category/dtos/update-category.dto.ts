import { CategoryEntity } from "../entities/category.entity";

export type UpdateCategoryDTO = Partial<Pick<CategoryEntity, "name" | "description">> &
    Pick<CategoryEntity, "uid">;

export type UpdateCategoryResponseDTO = Pick<
    CategoryEntity,
    "uid" | "name" | "description" | "updatedAt" | "updatedBy"
>;
