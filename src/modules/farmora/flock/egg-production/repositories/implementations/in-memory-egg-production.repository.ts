import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { DateUtil } from "@/shared/utils/date/date.util";
import { PaginationUtil } from "@/shared/utils/pagination/pagination.util";
import { SortUtil } from "@/shared/utils/sort/sort.util";
import { StringUtil } from "@/shared/utils/string/string.util";

import { FindEggProductionsDTO } from "../../dtos/find-egg-production.dto";
import { EggProductionProps } from "../../entities/egg-production.props";
import { IEggProductionRepository } from "../egg-production-repository.interface";

export class InMemoryEggProductionRepository implements IEggProductionRepository {
    private eggProductions: EggProductionProps[] = [];

    async findByUID(platformUID: string, uid: string): Promise<Result<EggProductionProps | null>> {
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
    ): Promise<Result<EggProductionProps | null>> {
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
    ): Promise<Result<EggProductionProps[]>> {
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
                (eggProduction) => eggProduction.productionDate >= filters.startDate!
            );
        }

        if (filters?.endDate) {
            eggProductions = eggProductions.filter(
                (eggProduction) => eggProduction.productionDate <= filters.endDate!
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

        if (filters?.page && filters?.limit) {
            eggProductions = PaginationUtil.paginate(eggProductions, filters.page, filters.limit);
        }

        return ResultFactory.success(eggProductions);
    }

    async register(eggProduction: EggProductionProps): Promise<Result<EggProductionProps>> {
        this.eggProductions.push(eggProduction);

        return ResultFactory.success(eggProduction);
    }

    async update(eggProduction: EggProductionProps): Promise<Result<EggProductionProps>> {
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
