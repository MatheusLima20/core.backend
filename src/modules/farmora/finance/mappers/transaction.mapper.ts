import { ResponseTransactionDTO } from "../dtos/transaction-response.dto";
import { UpdateTransactionResponseDTO } from "../dtos/update-transaction.dto";
import { TransactionProps } from "../entities/transaction.props";

export const TransactionMapper = {
    toResponseDTO: (transaction: TransactionProps): ResponseTransactionDTO => {
        return {
            uid: transaction.uid,
            platformUID: transaction.platformUID,
            categoryUID: transaction.categoryUID,
            type: transaction.type,
            description: transaction.description,
            amount: transaction.amount,
            occurredAt: transaction.occurredAt,
            source: transaction.source,
            sourceUID: transaction.sourceUID,
            notes: transaction.notes,
            createdBy: transaction.createdBy,
            updatedBy: transaction.updatedBy,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
        };
    },

    toResponseDTOList: (transactions: TransactionProps[]): ResponseTransactionDTO[] => {
        return transactions.map(TransactionMapper.toResponseDTO);
    },

    toUpdatedResponseDTO: (transaction: TransactionProps): UpdateTransactionResponseDTO => {
        return {
            uid: transaction.uid,
            description: transaction.description,
            amount: transaction.amount,
            categoryUID: transaction.categoryUID,
            occurredAt: transaction.occurredAt,
            updatedBy: transaction.updatedBy,
            updatedAt: transaction.updatedAt,
        };
    },
};
