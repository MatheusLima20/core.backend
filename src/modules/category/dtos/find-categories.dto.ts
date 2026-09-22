import { CategoryEntity } from "../entities/category.entity";

export interface FindCategoriesDTO {
    name?: string;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<CategoryEntity, "name" | "createdAt">;

    order?: "asc" | "desc";
}
