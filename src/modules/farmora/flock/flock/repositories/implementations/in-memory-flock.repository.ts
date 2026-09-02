import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { SortUtil } from "@/shared/utils/sort/sort.util";
import { StringUtil } from "@/shared/utils/string/string.util";

import { FindFlocksDTO } from "../../dtos/find-flock.dto";
import { FlockEntity } from "../../entities/flock.entity";
import { IFlockRepository } from "../flock-repository.interface";

export class InMemoryFlockRepository implements IFlockRepository {
    private flocks: FlockEntity[] = [];

    async findByUID(platformUID: string, uid: string): Promise<Result<FlockEntity | null>> {
        const flock =
            this.flocks.find(
                (flock) =>
                    StringUtil.equals(flock.platformUID!, platformUID) &&
                    StringUtil.equals(flock.uid, uid)
            ) ?? null;

        return ResultFactory.success(flock);
    }

    async findByName(platformUID: string, name: string): Promise<Result<FlockEntity[]>> {
        const flocks = this.flocks.filter(
            (flock) => flock.platformUID === platformUID && StringUtil.equals(flock.name, name)
        );

        return ResultFactory.success(flocks);
    }

    async find(
        platformUID: string,
        filters?: FindFlocksDTO
    ): Promise<Result<PaginationResult<FlockEntity>>> {
        let flocks = this.flocks.filter((flock) =>
            StringUtil.equals(flock.platformUID!, platformUID)
        );

        if (filters?.name) {
            flocks = flocks.filter((flock) => StringUtil.contains(flock.name, filters.name!));
        }

        if (filters?.status) {
            flocks = flocks.filter((flock) => StringUtil.equals(flock.status, filters.status!));
        }

        if (filters?.minQuantity !== undefined) {
            flocks = flocks.filter((flock) => flock.quantity >= filters.minQuantity!);
        }

        if (filters?.maxQuantity !== undefined) {
            flocks = flocks.filter((flock) => flock.quantity <= filters.maxQuantity!);
        }

        if (filters?.orderBy) {
            flocks = SortUtil.sort({
                items: flocks,
                orderBy: filters.orderBy,
                order: filters.order,
            });
        }

        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const total = flocks.length;
        const totalPages = Math.ceil(total / limit);

        const start = (page - 1) * limit;

        const data = flocks.slice(start, start + limit);

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages,
        });
    }

    async register(flock: FlockEntity): Promise<Result<FlockEntity>> {
        this.flocks.push(flock);

        return ResultFactory.success(flock);
    }

    async update(flock: FlockEntity): Promise<Result<FlockEntity>> {
        const index = this.flocks.findIndex((f) => StringUtil.equals(f.uid, flock.uid));

        this.flocks[index] = flock;

        return ResultFactory.success(flock);
    }

    async delete(uid: string): Promise<Result<void>> {
        const index = this.flocks.findIndex((flock) => StringUtil.equals(flock.uid, uid));

        if (index !== -1) {
            this.flocks.splice(index, 1);
        }

        return ResultFactory.success(undefined);
    }
}
