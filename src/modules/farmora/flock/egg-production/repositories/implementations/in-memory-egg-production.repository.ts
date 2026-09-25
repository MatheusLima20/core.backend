import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { DateUtil } from "@/shared/utils/date/date.util";
import { SortUtil } from "@/shared/utils/sort/sort.util";
import { StringUtil } from "@/shared/utils/string/string.util";

import { FlockStatus } from "../../../flock/enums/flock-status.enum";
import { InMemoryFlockRepository } from "../../../flock/repositories/implementations/in-memory-flock.repository";
import { EggProductionSummaryResponseDTO } from "../../dtos/egg-production-summary";
import { FindEggProductionsDTO } from "../../dtos/find-egg-production.dto";
import { EggProductionEntity } from "../../entities/egg-production.entity";
import { EggProductionWithFlock } from "../../types/egg-production-with.flock";
import { IEggProductionRepository } from "../egg-production-repository.interface";

export class InMemoryEggProductionRepository implements IEggProductionRepository {
    constructor(private readonly flockRepository: InMemoryFlockRepository) {}

    private eggProductions: EggProductionEntity[] = [];

    async findByUID(platformUID: string, uid: string): Promise<Result<EggProductionEntity | null>> {
        const eggProduction =
            this.eggProductions.find(
                (eggProduction) =>
                    StringUtil.equals(eggProduction.platformUID!, platformUID) &&
                    StringUtil.equals(eggProduction.uid, uid)
            ) ?? null;

        return ResultFactory.success(eggProduction);
    }

    async findByFlockAndDate(
        platformUID: string,
        flockUID: string,
        productionDate: Date
    ): Promise<Result<EggProductionEntity | null>> {
        const eggProduction =
            this.eggProductions.find(
                (eggProduction) =>
                    StringUtil.equals(eggProduction.platformUID, platformUID) &&
                    StringUtil.equals(eggProduction.flockUID, flockUID) &&
                    DateUtil.isSameDay(eggProduction.productionDate, productionDate)
            ) ?? null;

        return ResultFactory.success(eggProduction);
    }

    async find(
        platformUID: string,
        filters?: FindEggProductionsDTO
    ): Promise<Result<PaginationResult<EggProductionWithFlock>>> {
        let eggProductions = this.eggProductions.filter((eggProduction) =>
            StringUtil.equals(eggProduction.platformUID!, platformUID)
        );

        if (filters?.flockUID) {
            eggProductions = eggProductions.filter((eggProduction) =>
                StringUtil.equals(eggProduction.flockUID, filters.flockUID!)
            );
        }

        if (filters?.productionDate) {
            eggProductions = eggProductions.filter((eggProduction) =>
                DateUtil.isSameDay(eggProduction.productionDate, filters.productionDate!)
            );
        }

        if (filters?.startDate) {
            eggProductions = eggProductions.filter(
                (eggProduction) =>
                    !DateUtil.isBefore(eggProduction.productionDate, filters.startDate!)
            );
        }

        if (filters?.endDate) {
            eggProductions = eggProductions.filter(
                (eggProduction) => !DateUtil.isAfter(eggProduction.productionDate, filters.endDate!)
            );
        }

        if (filters?.minTotalEggs !== undefined) {
            eggProductions = eggProductions.filter(
                (eggProduction) => eggProduction.totalEggs >= filters.minTotalEggs!
            );
        }

        if (filters?.maxTotalEggs !== undefined) {
            eggProductions = eggProductions.filter(
                (eggProduction) => eggProduction.totalEggs <= filters.maxTotalEggs!
            );
        }

        if (filters?.orderBy) {
            eggProductions = SortUtil.sort({
                items: eggProductions,
                orderBy: filters.orderBy,
                order: filters.order,
            });
        }

        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const total = eggProductions.length;
        const totalPages = Math.ceil(total / limit);

        const start = (page - 1) * limit;

        const paginatedEggProductions = eggProductions.slice(start, start + limit);

        const data: EggProductionWithFlock[] = [];

        for (const production of paginatedEggProductions) {
            const flockResult = await this.flockRepository.findByUID(
                production.flockUID,
                platformUID
            );

            if (isFailure(flockResult)) {
                return ResultFactory.failure(flockResult.error);
            }

            const flock = flockResult.data;

            data.push({
                production,
                flock: {
                    name: flock?.name ?? "",
                },
            });
        }

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages,
        });
    }

    async findSummary(platformUID: string): Promise<Result<EggProductionSummaryResponseDTO>> {
        const today = new Date();

        const eggProductions = this.eggProductions.filter(
            (eggProduction) =>
                StringUtil.equals(eggProduction.platformUID!, platformUID) &&
                DateUtil.isSameDay(eggProduction.productionDate, today)
        );

        const totalCollectedToday = eggProductions.reduce(
            (total, production) => total + production.totalEggs,
            0
        );

        const discardedEggs = eggProductions.reduce(
            (total, production) =>
                total +
                (production.crackedEggs ?? 0) +
                (production.dirtyEggs ?? 0) +
                (production.discardedEggs ?? 0),
            0
        );

        const commercialEggs = totalCollectedToday - discardedEggs;

        const flocksResult = await this.flockRepository.find(platformUID, {
            status: FlockStatus.IN_PRODUCTION,
            page: 1,
            limit: 1000,
        });

        if (isFailure(flocksResult)) {
            return ResultFactory.failure(flocksResult.error);
        }

        const totalBirds = flocksResult.data.data.reduce(
            (total, flock) => total + flock.quantity,
            0
        );

        const layingRate = totalBirds > 0 ? (totalCollectedToday / totalBirds) * 100 : 0;

        return ResultFactory.success({
            totalCollectedToday,
            layingRate,
            commercialEggs,
            discardedEggs,
        });
    }

    async register(eggProduction: EggProductionEntity): Promise<Result<EggProductionEntity>> {
        this.eggProductions.push(eggProduction);

        return ResultFactory.success(eggProduction);
    }

    async update(eggProduction: EggProductionEntity): Promise<Result<EggProductionEntity>> {
        const index = this.eggProductions.findIndex((item) =>
            StringUtil.equals(item.uid, eggProduction.uid)
        );

        this.eggProductions[index] = eggProduction;

        return ResultFactory.success(eggProduction);
    }

    async delete(uid: string): Promise<Result<void>> {
        const index = this.eggProductions.findIndex((item) => StringUtil.equals(item.uid, uid));

        if (index !== -1) {
            this.eggProductions.splice(index, 1);
        }

        return ResultFactory.success(undefined);
    }
}
