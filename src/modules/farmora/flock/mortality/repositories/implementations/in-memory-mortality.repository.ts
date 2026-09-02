import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { DateUtil } from "@/shared/utils/date/date.util";
import { SortUtil } from "@/shared/utils/sort/sort.util";
import { StringUtil } from "@/shared/utils/string/string.util";

import { FindMortalitiesDTO } from "../../dtos/find-mortality.dto";
import { MortalityEntity } from "../../entities/mortality.entity";
import { IMortalityRepository } from "../mortality-repository.interface";

export class InMemoryMortalityRepository implements IMortalityRepository {
    private mortalities: MortalityEntity[] = [];

    async findByUID(platformUID: string, uid: string): Promise<Result<MortalityEntity | null>> {
        const mortality =
            this.mortalities.find(
                (mortality) =>
                    StringUtil.equals(mortality.platformUID!, platformUID) &&
                    StringUtil.equals(mortality.uid, uid)
            ) ?? null;

        return ResultFactory.success(mortality);
    }

    async find(
        platformUID: string,
        filters?: FindMortalitiesDTO
    ): Promise<Result<PaginationResult<MortalityEntity>>> {
        let mortalities = this.mortalities.filter((mortality) =>
            StringUtil.equals(mortality.platformUID!, platformUID)
        );

        if (filters?.flockUID) {
            mortalities = mortalities.filter((mortality) =>
                StringUtil.equals(mortality.flockUID, filters.flockUID!)
            );
        }

        if (filters?.mortalityDate) {
            mortalities = mortalities.filter((mortality) =>
                DateUtil.isSameDay(mortality.mortalityDate, filters.mortalityDate!)
            );
        }

        if (filters?.startDate) {
            mortalities = mortalities.filter(
                (mortality) => mortality.mortalityDate >= filters.startDate!
            );
        }

        if (filters?.endDate) {
            mortalities = mortalities.filter(
                (mortality) => mortality.mortalityDate <= filters.endDate!
            );
        }

        if (filters?.cause) {
            mortalities = mortalities.filter((mortality) => mortality.cause === filters.cause);
        }

        if (filters?.minQuantity !== undefined) {
            mortalities = mortalities.filter(
                (mortality) => mortality.quantity >= filters.minQuantity!
            );
        }

        if (filters?.maxQuantity !== undefined) {
            mortalities = mortalities.filter(
                (mortality) => mortality.quantity <= filters.maxQuantity!
            );
        }

        if (filters?.orderBy) {
            mortalities = SortUtil.sort({
                items: mortalities,
                orderBy: filters.orderBy,
                order: filters.order,
            });
        }

        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const total = mortalities.length;
        const totalPages = Math.ceil(total / limit);

        const start = (page - 1) * limit;

        const data = mortalities.slice(start, start + limit);

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages,
        });
    }

    async register(mortality: MortalityEntity): Promise<Result<MortalityEntity>> {
        this.mortalities.push(mortality);

        return ResultFactory.success(mortality);
    }

    async update(mortality: MortalityEntity): Promise<Result<MortalityEntity>> {
        const index = this.mortalities.findIndex((item) =>
            StringUtil.equals(item.uid, mortality.uid)
        );

        this.mortalities[index] = mortality;

        return ResultFactory.success(mortality);
    }

    async delete(uid: string): Promise<Result<void>> {
        const index = this.mortalities.findIndex((item) => StringUtil.equals(item.uid, uid));

        if (index !== -1) {
            this.mortalities.splice(index, 1);
        }

        return ResultFactory.success(undefined);
    }
}
