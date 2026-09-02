import { Repository } from "typeorm";

import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindEggProductionsDTO } from "../../dtos/find-egg-production.dto";
import { EggProductionEntity } from "../../entities/egg-production.entity";
import { IEggProductionRepository } from "../egg-production-repository.interface";

export class TypeORMEggProductionRepository implements IEggProductionRepository {
    constructor(private readonly eggProductionRepository: Repository<EggProductionEntity>) {}

    async findByUID(platformUID: string, uid: string): Promise<Result<EggProductionEntity | null>> {
        const eggProduction = await this.eggProductionRepository.findOne({
            where: {
                uid,
                platformUID,
            },
        });

        return ResultFactory.success(eggProduction);
    }

    async findByFlockAndDate(
        platformUID: string,
        flockUID: string,
        productionDate: Date
    ): Promise<Result<EggProductionEntity | null>> {
        const eggProduction = await this.eggProductionRepository
            .createQueryBuilder("eggProduction")
            .where("eggProduction.platformUID = :platformUID", {
                platformUID,
            })
            .andWhere("eggProduction.flockUID = :flockUID", {
                flockUID,
            })
            .andWhere("DATE(eggProduction.productionDate) = DATE(:productionDate)", {
                productionDate,
            })
            .getOne();

        return ResultFactory.success(eggProduction);
    }

    async find(
        platformUID: string,
        filters?: FindEggProductionsDTO
    ): Promise<Result<PaginationResult<EggProductionEntity>>> {
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const query = this.eggProductionRepository
            .createQueryBuilder("eggProduction")
            .where("eggProduction.platformUID = :platformUID", {
                platformUID,
            });

        if (filters?.flockUID) {
            query.andWhere("eggProduction.flockUID = :flockUID", {
                flockUID: filters.flockUID,
            });
        }

        if (filters?.productionDate) {
            query.andWhere("DATE(eggProduction.productionDate) = DATE(:productionDate)", {
                productionDate: filters.productionDate,
            });
        }

        if (filters?.startDate) {
            query.andWhere("eggProduction.productionDate >= :startDate", {
                startDate: filters.startDate,
            });
        }

        if (filters?.endDate) {
            query.andWhere("eggProduction.productionDate <= :endDate", {
                endDate: filters.endDate,
            });
        }

        if (filters?.minTotalEggs !== undefined) {
            query.andWhere("eggProduction.totalEggs >= :minTotalEggs", {
                minTotalEggs: filters.minTotalEggs,
            });
        }

        if (filters?.maxTotalEggs !== undefined) {
            query.andWhere("eggProduction.totalEggs <= :maxTotalEggs", {
                maxTotalEggs: filters.maxTotalEggs,
            });
        }

        if (filters?.orderBy) {
            query.orderBy(
                `eggProduction.${filters.orderBy}`,
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

    async register(eggProduction: EggProductionEntity): Promise<Result<EggProductionEntity>> {
        const savedEggProduction = await this.eggProductionRepository.save(eggProduction);

        return ResultFactory.success(savedEggProduction);
    }

    async update(eggProduction: EggProductionEntity): Promise<Result<EggProductionEntity>> {
        const savedEggProduction = await this.eggProductionRepository.save(eggProduction);

        return ResultFactory.success(savedEggProduction);
    }

    async delete(uid: string): Promise<Result<void>> {
        await this.eggProductionRepository.delete(uid);

        return ResultFactory.ok();
    }
}
