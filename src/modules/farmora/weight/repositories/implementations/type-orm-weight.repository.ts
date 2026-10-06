import { Repository } from "typeorm";

import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindWeightsDTO } from "../../dtos/find-weights.dto";
import { WeightEntity } from "../../entities/weight.entity";
import { IWeightRepository } from "../weight-repository.interface";

export class TypeORMWeightRepository implements IWeightRepository {
    constructor(private readonly weightRepository: Repository<WeightEntity>) {}

    async findByUID(platformUID: string, uid: string): Promise<Result<WeightEntity | null>> {
        const weight = await this.weightRepository.findOne({
            where: {
                uid,
                platformUID,
            },
        });

        return ResultFactory.success(weight);
    }

    async find(
        platformUID: string,
        filters?: FindWeightsDTO
    ): Promise<Result<PaginationResult<WeightEntity>>> {
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const query = this.weightRepository
            .createQueryBuilder("weight")
            .where("weight.platformUID = :platformUID", {
                platformUID,
            });

        if (filters?.flockUID) {
            query.andWhere("weight.flockUID = :flockUID", {
                flockUID: filters.flockUID,
            });
        }

        if (filters?.weighingDate) {
            query.andWhere("DATE(weight.weighingDate) = DATE(:weighingDate)", {
                weighingDate: filters.weighingDate,
            });
        }

        if (filters?.startDate) {
            query.andWhere("weight.weighingDate >= :startDate", {
                startDate: filters.startDate,
            });
        }

        if (filters?.endDate) {
            query.andWhere("weight.weighingDate <= :endDate", {
                endDate: filters.endDate,
            });
        }

        if (filters?.orderBy) {
            query.orderBy(
                `weight.${filters.orderBy}`,
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

    async exists(
        platformUID: string,
        data: {
            flockUID: string;
            weighingDate: Date;
            ignoreUID?: string;
        }
    ): Promise<Result<boolean>> {
        const query = this.weightRepository
            .createQueryBuilder("weight")
            .where("weight.platformUID = :platformUID", {
                platformUID,
            })
            .andWhere("weight.flockUID = :flockUID", {
                flockUID: data.flockUID,
            })
            .andWhere("DATE(weight.weighingDate) = DATE(:weighingDate)", {
                weighingDate: data.weighingDate,
            });

        if (data.ignoreUID) {
            query.andWhere("weight.uid != :ignoreUID", {
                ignoreUID: data.ignoreUID,
            });
        }

        const exists = await query.getExists();

        return ResultFactory.success(exists);
    }

    async register(weight: WeightEntity): Promise<Result<WeightEntity>> {
        const savedWeight = await this.weightRepository.save(weight);

        return ResultFactory.success(savedWeight);
    }

    async update(weight: WeightEntity): Promise<Result<WeightEntity>> {
        const savedWeight = await this.weightRepository.save(weight);

        return ResultFactory.success(savedWeight);
    }

    async delete(uid: string): Promise<Result<void>> {
        await this.weightRepository.delete(uid);

        return ResultFactory.ok();
    }
}
