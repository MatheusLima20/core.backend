import { Repository } from "typeorm";

import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindLossesDTO } from "../../dtos/find-losses.dto";
import { LossEntity } from "../../entities/loss.entity";
import { ILossRepository } from "../loss-repository.interface";

export class TypeORMLossRepository implements ILossRepository {
    constructor(private readonly lossRepository: Repository<LossEntity>) {}

    async findByUID(platformUID: string, uid: string): Promise<Result<LossEntity | null>> {
        const loss = await this.lossRepository.findOne({
            where: {
                uid,
                platformUID,
            },
        });

        return ResultFactory.success(loss);
    }

    async find(
        platformUID: string,
        filters?: FindLossesDTO
    ): Promise<Result<PaginationResult<LossEntity>>> {
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const query = this.lossRepository
            .createQueryBuilder("loss")
            .where("loss.platformUID = :platformUID", {
                platformUID,
            });

        if (filters?.transactionUID) {
            query.andWhere("loss.transactionUID = :transactionUID", {
                transactionUID: filters.transactionUID,
            });
        }

        if (filters?.productUID) {
            query.andWhere("loss.productUID = :productUID", {
                productUID: filters.productUID,
            });
        }

        if (filters?.reason) {
            query.andWhere("loss.reason = :reason", {
                reason: filters.reason,
            });
        }

        if (filters?.occurredAtStart) {
            query.andWhere("loss.occurredAt >= :occurredAtStart", {
                occurredAtStart: filters.occurredAtStart,
            });
        }

        if (filters?.occurredAtEnd) {
            query.andWhere("loss.occurredAt <= :occurredAtEnd", {
                occurredAtEnd: filters.occurredAtEnd,
            });
        }

        if (filters?.minQuantity !== undefined) {
            query.andWhere("loss.quantity >= :minQuantity", {
                minQuantity: filters.minQuantity,
            });
        }

        if (filters?.maxQuantity !== undefined) {
            query.andWhere("loss.quantity <= :maxQuantity", {
                maxQuantity: filters.maxQuantity,
            });
        }

        if (filters?.minTotalCost !== undefined) {
            query.andWhere("loss.totalCost >= :minTotalCost", {
                minTotalCost: filters.minTotalCost,
            });
        }

        if (filters?.maxTotalCost !== undefined) {
            query.andWhere("loss.totalCost <= :maxTotalCost", {
                maxTotalCost: filters.maxTotalCost,
            });
        }

        if (filters?.orderBy) {
            query.orderBy(
                `loss.${filters.orderBy}`,
                filters.order?.toUpperCase() === "DESC" ? "DESC" : "ASC"
            );
        }

        const total = await query.getCount();

        query.skip((page - 1) * limit).take(limit);

        const data = await query.getMany();

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        });
    }

    async register(loss: LossEntity): Promise<Result<LossEntity>> {
        const savedLoss = await this.lossRepository.save(loss);

        return ResultFactory.success(savedLoss);
    }

    async update(loss: LossEntity): Promise<Result<LossEntity>> {
        const savedLoss = await this.lossRepository.save(loss);

        return ResultFactory.success(savedLoss);
    }

    async delete(uid: string): Promise<Result<void>> {
        await this.lossRepository.delete(uid);

        return ResultFactory.ok();
    }
}
