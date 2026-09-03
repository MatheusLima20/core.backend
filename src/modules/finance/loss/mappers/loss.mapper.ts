import { CreateLossResponseDTO } from "../dtos/create-loss.dto";
import { ResponseLossDTO } from "../dtos/loss-response.dto";
import { UpdateLossResponseDTO } from "../dtos/update-loss.dto";
import { LossEntity } from "../entities/loss.entity";

export const LossMapper = {
    toResponseDTO: (loss: LossEntity): ResponseLossDTO => {
        return {
            uid: loss.uid,
            platformUID: loss.platformUID,
            transactionUID: loss.transactionUID,
            productUID: loss.productUID,
            quantity: loss.quantity,
            unitCost: loss.unitCost,
            totalCost: loss.totalCost,
            reason: loss.reason,
            description: loss.description,
            occurredAt: loss.occurredAt,
            createdBy: loss.createdBy,
            updatedBy: loss.updatedBy,
            createdAt: loss.createdAt,
            updatedAt: loss.updatedAt,
        };
    },

    toResponseDTOList: (losses: LossEntity[]): ResponseLossDTO[] => {
        return losses.map(LossMapper.toResponseDTO);
    },

    toCreateResponseDTO: (loss: LossEntity): CreateLossResponseDTO => {
        return {
            uid: loss.uid,
            platformUID: loss.platformUID,
            transactionUID: loss.transactionUID,
            productUID: loss.productUID,
            quantity: loss.quantity,
            unitCost: loss.unitCost,
            totalCost: loss.totalCost,
            reason: loss.reason,
            description: loss.description,
            occurredAt: loss.occurredAt,
            createdAt: loss.createdAt,
            createdBy: loss.createdBy,
        };
    },

    toUpdatedResponseDTO: (loss: LossEntity): UpdateLossResponseDTO => {
        return {
            uid: loss.uid,
            transactionUID: loss.transactionUID,
            productUID: loss.productUID,
            quantity: loss.quantity,
            unitCost: loss.unitCost,
            totalCost: loss.totalCost,
            reason: loss.reason,
            description: loss.description,
            occurredAt: loss.occurredAt,
            updatedBy: loss.updatedBy,
            updatedAt: loss.updatedAt,
        };
    },
};
