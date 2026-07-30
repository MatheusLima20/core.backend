import { CreateTransactionCategoryResponseDTO } from "../dtos/create-transaction-category.dto";
import { TransactionCategoryResponseDTO } from "../dtos/transaction-category-response.dto";
import { UpdateTransactionCategoryResponseDTO } from "../dtos/update-transaction-category.dto";
import { TransactionCategoryProps } from "../entities/transaction-category.props";

export const TransactionCategoryMapper = {
    toResponseDTO: (category: TransactionCategoryProps): TransactionCategoryResponseDTO => {
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
        categories: TransactionCategoryProps[]
    ): TransactionCategoryResponseDTO[] => {
        return categories.map(TransactionCategoryMapper.toResponseDTO);
    },

    toCreatedResponseDTO: (
        category: TransactionCategoryProps
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
        category: TransactionCategoryProps
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
