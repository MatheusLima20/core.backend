import { Repository } from "typeorm";

import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FlockEntity } from "../../../flock/entities/flock.entity";
import { FlockStatus } from "../../../flock/enums/flock-status.enum";
import { EggProductionSummaryResponseDTO } from "../../dtos/egg-production-summary";
import { FindEggProductionsDTO } from "../../dtos/find-egg-production.dto";
import { EggProductionEntity } from "../../entities/egg-production.entity";
import { EggProductionWithFlock } from "../../types/egg-production-with.flock";
import { IEggProductionRepository } from "../egg-production-repository.interface";

export class TypeORMEggProductionRepository implements IEggProductionRepository {
    constructor(
        private readonly eggProductionRepository: Repository<EggProductionEntity>,
        private readonly flockRepository: Repository<FlockEntity>
    ) {}

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
        platformUID?: string,
        filters?: FindEggProductionsDTO
    ): Promise<Result<PaginationResult<EggProductionWithFlock>>> {
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const query = this.eggProductionRepository
            .createQueryBuilder("eggProduction")
            .leftJoin(FlockEntity, "flock", "flock.uid = eggProduction.flockUID")
            .addSelect(["flock.uid", "flock.name"])
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

        const { entities, raw } = await query.getRawAndEntities();

        const data: EggProductionWithFlock[] = entities.map((production, index) => ({
            production,
            flock: {
                name: raw[index].flock_name,
            },
        }));

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        });
    }

    async findSummary(platformUID: string): Promise<Result<EggProductionSummaryResponseDTO>> {
        const today = new Date();

        const productionResult = await this.eggProductionRepository
            .createQueryBuilder("eggProduction")
            .select("COALESCE(SUM(eggProduction.totalEggs), 0)", "totalCollectedToday")
            .addSelect(
                `COALESCE(
        SUM(
          COALESCE(eggProduction.crackedEggs, 0) +
          COALESCE(eggProduction.dirtyEggs, 0) +
          COALESCE(eggProduction.discardedEggs, 0)
        ),
        0
      )`,
                "discardedEggs"
            )
            .where("eggProduction.platformUID = :platformUID", {
                platformUID,
            })
            .andWhere("DATE(eggProduction.productionDate) = DATE(:today)", { today })
            .getRawOne<{
                totalCollectedToday: string;
                discardedEggs: string;
            }>();

        const flockResult = await this.flockRepository
            .createQueryBuilder("flock")
            .select("COALESCE(SUM(flock.quantity), 0)", "totalBirds")
            .where("flock.platformUID = :platformUID", {
                platformUID,
            })
            .andWhere("flock.status = :status", {
                status: FlockStatus.IN_PRODUCTION,
            })
            .getRawOne<{
                totalBirds: string;
            }>();

        const totalCollectedToday = Number(productionResult?.totalCollectedToday ?? 0);

        const discardedEggs = Number(productionResult?.discardedEggs ?? 0);

        const totalBirds = Number(flockResult?.totalBirds ?? 0);

        const commercialEggs = Math.max(totalCollectedToday - discardedEggs, 0);

        const layingRate = totalBirds > 0 ? (totalCollectedToday / totalBirds) * 100 : 0;

        return ResultFactory.success({
            totalCollectedToday,
            layingRate,
            commercialEggs,
            discardedEggs,
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
