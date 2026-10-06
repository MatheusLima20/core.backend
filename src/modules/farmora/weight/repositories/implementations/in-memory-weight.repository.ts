import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { DateUtil } from "@/shared/utils/date/date.util";
import { SortUtil } from "@/shared/utils/sort/sort.util";
import { StringUtil } from "@/shared/utils/string/string.util";

import { FindWeightsDTO } from "../../dtos/find-weights.dto";
import { WeightEntity } from "../../entities/weight.entity";
import { IWeightRepository } from "../weight-repository.interface";

export class InMemoryWeightRepository implements IWeightRepository {
    private weights: WeightEntity[] = [];

    async findByUID(platformUID: string, uid: string): Promise<Result<WeightEntity | null>> {
        const weight =
            this.weights.find(
                (weight) =>
                    StringUtil.equals(weight.platformUID!, platformUID) &&
                    StringUtil.equals(weight.uid, uid)
            ) ?? null;

        return ResultFactory.success(weight);
    }

    async find(
        platformUID: string,
        filters?: FindWeightsDTO
    ): Promise<Result<PaginationResult<WeightEntity>>> {
        let weights = this.weights.filter((weight) =>
            StringUtil.equals(weight.platformUID!, platformUID)
        );

        if (filters?.flockUID) {
            weights = weights.filter((weight) =>
                StringUtil.equals(weight.flockUID, filters.flockUID!)
            );
        }

        if (filters?.weighingDate) {
            weights = weights.filter((weight) =>
                DateUtil.isSameDay(weight.weighingDate, filters.weighingDate!)
            );
        }

        if (filters?.startDate) {
            weights = weights.filter((weight) => weight.weighingDate >= filters.startDate!);
        }

        if (filters?.endDate) {
            weights = weights.filter((weight) => weight.weighingDate <= filters.endDate!);
        }

        if (filters?.orderBy) {
            weights = SortUtil.sort({
                items: weights,
                orderBy: filters.orderBy,
                order: filters.order,
            });
        }

        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const total = weights.length;
        const totalPages = Math.ceil(total / limit);

        const start = (page - 1) * limit;

        const data = weights.slice(start, start + limit);

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages,
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
        const exists = this.weights.some(
            (weight) =>
                StringUtil.equals(weight.platformUID!, platformUID) &&
                StringUtil.equals(weight.flockUID, data.flockUID) &&
                DateUtil.isSameDay(weight.weighingDate, data.weighingDate) &&
                (!data.ignoreUID || !StringUtil.equals(weight.uid, data.ignoreUID))
        );

        return ResultFactory.success(exists);
    }

    async register(weight: WeightEntity): Promise<Result<WeightEntity>> {
        this.weights.push(weight);

        return ResultFactory.success(weight);
    }

    async update(weight: WeightEntity): Promise<Result<WeightEntity>> {
        const index = this.weights.findIndex((item) => StringUtil.equals(item.uid, weight.uid));

        this.weights[index] = weight;

        return ResultFactory.success(weight);
    }

    async delete(uid: string): Promise<Result<void>> {
        const index = this.weights.findIndex((item) => StringUtil.equals(item.uid, uid));

        if (index !== -1) {
            this.weights.splice(index, 1);
        }

        return ResultFactory.success(undefined);
    }
}
