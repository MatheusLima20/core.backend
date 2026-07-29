import { ResponseLossDTO } from "../dtos/loss-response.dto";
import { UpdateLossResponseDTO } from "../dtos/update-loss.dto";
import { LossProps } from "../entities/loss.props";

export const LossMapper = {
    toResponseDTO: (loss: LossProps): ResponseLossDTO => {
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

    toResponseDTOList: (losses: LossProps[]): ResponseLossDTO[] => {
        return losses.map(LossMapper.toResponseDTO);
    },

    toUpdatedResponseDTO: (loss: LossProps): UpdateLossResponseDTO => {
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
