import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { DateUtil } from "@/shared/utils/date/date.util";
import { PaginationUtil } from "@/shared/utils/pagination/pagination.util";
import { SortUtil } from "@/shared/utils/sort/sort.util";
import { StringUtil } from "@/shared/utils/string/string.util";

import { FindWeightsDTO } from "../../dtos/find-weights.dto";
import { WeightProps } from "../../entities/weight.props";
import { IWeightRepository } from "../weight-repository.interface";

export class InMemoryWeightRepository implements IWeightRepository {
    private weights: WeightProps[] = [];

    async findByUID(platformUID: string, uid: string): Promise<Result<WeightProps | null>> {
        const weight =
            this.weights.find(
                (weight) =>
                    StringUtil.equals(weight.platformUID!, platformUID) &&
                    StringUtil.equals(weight.uid, uid)
            ) ?? null;

        return ResultFactory.success(weight);
    }

    async find(platformUID: string, filters?: FindWeightsDTO): Promise<Result<WeightProps[]>> {
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

        if (filters?.page && filters?.limit) {
            weights = PaginationUtil.paginate(weights, filters.page, filters.limit);
        }

        return ResultFactory.success(weights);
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

    async register(weight: WeightProps): Promise<Result<WeightProps>> {
        this.weights.push(weight);

        return ResultFactory.success(weight);
    }

    async update(weight: WeightProps): Promise<Result<WeightProps>> {
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
