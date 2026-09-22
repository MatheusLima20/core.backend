import { CategoryResponseDTO } from "../dtos/category-response.dto";
import { CreateCategoryResponseDTO } from "../dtos/create-category.dto";
import { UpdateCategoryResponseDTO } from "../dtos/update-category.dto";
import { CategoryEntity } from "../entities/category.entity";

export const CategoryMapper = {
    toResponseDTO: (category: CategoryEntity): CategoryResponseDTO => {
        return {
            uid: category.uid,
            platformUID: category.platformUID,
            name: category.name,
            description: category.description,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
            createdBy: category.createdBy,
            updatedBy: category.updatedBy,
        };
    },

    toResponseDTOList: (categories: CategoryEntity[]): CategoryResponseDTO[] => {
        return categories.map(CategoryMapper.toResponseDTO);
    },

    toCreatedResponseDTO: (category: CategoryEntity): CreateCategoryResponseDTO => {
        return {
            uid: category.uid,
            name: category.name,
            description: category.description,
            createdAt: category.createdAt,
            createdBy: category.createdBy,
        };
    },

    toUpdatedResponseDTO: (category: CategoryEntity): UpdateCategoryResponseDTO => {
        return {
            uid: category.uid,
            name: category.name,
            description: category.description,
            updatedAt: category.updatedAt,
            updatedBy: category.updatedBy,
        };
    },
};
