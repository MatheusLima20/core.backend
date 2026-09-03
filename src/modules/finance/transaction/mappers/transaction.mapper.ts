import { CreateTransactionResponseDTO } from "../dtos/create-transaction.dto";
import { ResponseTransactionDTO } from "../dtos/transaction-response.dto";
import { UpdateTransactionResponseDTO } from "../dtos/update-transaction.dto";
import { TransactionEntity } from "../entities/transaction.entity";

export const TransactionMapper = {
    toResponseDTO: (transaction: TransactionEntity): ResponseTransactionDTO => {
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

    toResponseDTOList: (transactions: TransactionEntity[]): ResponseTransactionDTO[] => {
        return transactions.map(TransactionMapper.toResponseDTO);
    },

    toCreateResponseDTO: (transaction: TransactionEntity): CreateTransactionResponseDTO => {
        return {
            uid: transaction.uid,
            platformUID: transaction.platformUID,
            description: transaction.description,
            occurredAt: transaction.occurredAt,
            type: transaction.type,
            amount: transaction.amount,
            notes: transaction.notes,
            categoryUID: transaction.categoryUID,
            source: transaction.source,
            sourceUID: transaction.sourceUID,
            createdAt: transaction.createdAt,
            createdBy: transaction.createdBy,
        };
    },

    toUpdatedResponseDTO: (transaction: TransactionEntity): UpdateTransactionResponseDTO => {
        return {
            uid: transaction.uid,
            description: transaction.description,
            type: transaction.type,
            amount: transaction.amount,
            notes: transaction.notes,
            categoryUID: transaction.categoryUID,
            occurredAt: transaction.occurredAt,
            updatedBy: transaction.updatedBy,
            updatedAt: transaction.updatedAt,
        };
    },
};
