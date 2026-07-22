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
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        };
    },

    toResponseDTOList: (
        categories: TransactionCategoryProps[]
    ): TransactionCategoryResponseDTO[] => {
        return categories.map(TransactionCategoryMapper.toResponseDTO);
    },

    toUpdatedResponseDTO: (
        category: TransactionCategoryProps
    ): UpdateTransactionCategoryResponseDTO => {
        return {
            uid: category.uid,
            name: category.name,
            description: category.description,
            updatedAt: category.updatedAt,
        };
    },
};
