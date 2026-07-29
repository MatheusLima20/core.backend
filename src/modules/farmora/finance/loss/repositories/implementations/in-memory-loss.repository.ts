import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindLossesDTO } from "../../dtos/find-losses.dto";
import { LossProps } from "../../entities/loss.props";
import { ILossRepository } from "../loss-repository.interface";

export class InMemoryLossRepository implements ILossRepository {
    private losses: LossProps[] = [];

    async findByUID(platformUID: string, uid: string): Promise<Result<LossProps | null>> {
        const loss =
            this.losses.find((loss) => loss.platformUID === platformUID && loss.uid === uid) ??
            null;

        return ResultFactory.success(loss);
    }

    async find(platformUID: string, filters?: FindLossesDTO): Promise<Result<LossProps[]>> {
        let losses = this.losses.filter((loss) => loss.platformUID === platformUID);

        if (filters?.transactionUID) {
            losses = losses.filter((loss) => loss.transactionUID === filters.transactionUID);
        }

        if (filters?.productUID) {
            losses = losses.filter((loss) => loss.productUID === filters.productUID);
        }

        if (filters?.reason) {
            losses = losses.filter((loss) => loss.reason === filters.reason);
        }

        if (filters?.occurredAtStart) {
            losses = losses.filter((loss) => loss.occurredAt >= filters.occurredAtStart!);
        }

        if (filters?.occurredAtEnd) {
            losses = losses.filter((loss) => loss.occurredAt <= filters.occurredAtEnd!);
        }

        if (filters?.minQuantity !== undefined) {
            losses = losses.filter((loss) => loss.quantity >= filters.minQuantity!);
        }

        if (filters?.maxQuantity !== undefined) {
            losses = losses.filter((loss) => loss.quantity <= filters.maxQuantity!);
        }

        if (filters?.minTotalCost !== undefined) {
            losses = losses.filter((loss) => loss.totalCost >= filters.minTotalCost!);
        }

        if (filters?.maxTotalCost !== undefined) {
            losses = losses.filter((loss) => loss.totalCost <= filters.maxTotalCost!);
        }

        if (filters?.orderBy) {
            losses.sort((a, b) => {
                const valueA = a[filters.orderBy!];
                const valueB = b[filters.orderBy!];

                if (valueA < valueB) return filters.order === "desc" ? 1 : -1;

                if (valueA > valueB) return filters.order === "desc" ? -1 : 1;

                return 0;
            });
        }

        if (filters?.page && filters?.limit) {
            const start = (filters.page - 1) * filters.limit;
            const end = start + filters.limit;

            losses = losses.slice(start, end);
        }

        return ResultFactory.success(losses);
    }

    async register(loss: LossProps): Promise<Result<LossProps>> {
        this.losses.push(loss);

        return ResultFactory.success(loss);
    }

    async update(loss: LossProps): Promise<Result<LossProps>> {
        const index = this.losses.findIndex((l) => l.uid === loss.uid);

        this.losses[index] = loss;

        return ResultFactory.success(loss);
    }

    async delete(uid: string): Promise<Result<void>> {
        const index = this.losses.findIndex((loss) => loss.uid === uid);

        if (index !== -1) {
            this.losses.splice(index, 1);
        }

        return ResultFactory.success(undefined);
    }
}
