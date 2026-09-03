import { CreateTransactionCategoryResponseDTO } from "../dtos/create-transaction-category.dto";
import { TransactionCategoryResponseDTO } from "../dtos/transaction-category-response.dto";
import { UpdateTransactionCategoryResponseDTO } from "../dtos/update-transaction-category.dto";
import { TransactionCategoryEntity } from "../entities/transaction-category.entity";

export const TransactionCategoryMapper = {
    toResponseDTO: (category: TransactionCategoryEntity): TransactionCategoryResponseDTO => {
        return {
            uid: category.uid,
            platformUID: category.platformUID,
            name: category.name,
            type: category.type,
            description: category.description,
            color: category.color,
            createdBy: category.createdBy,
            updatedBy: category.updatedBy,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        };
    },

    toResponseDTOList: (
        categories: TransactionCategoryEntity[]
    ): TransactionCategoryResponseDTO[] => {
        return categories.map(TransactionCategoryMapper.toResponseDTO);
    },

    toCreatedResponseDTO: (
        category: TransactionCategoryEntity
    ): CreateTransactionCategoryResponseDTO => {
        return {
            uid: category.uid,
            color: category.color,
            platformUID: category.platformUID,
            name: category.name,
            type: category.type,
            description: category.description,
            createdBy: category.createdBy,
            createdAt: category.createdAt,
        };
    },

    toUpdatedResponseDTO: (
        category: TransactionCategoryEntity
    ): UpdateTransactionCategoryResponseDTO => {
        return {
            uid: category.uid,
            name: category.name,
            type: category.type,
            description: category.description,
            updatedBy: category.updatedBy,
            updatedAt: category.updatedAt,
        };
    },
};
