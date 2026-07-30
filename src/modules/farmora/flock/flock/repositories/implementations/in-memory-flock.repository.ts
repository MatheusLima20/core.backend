import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { PaginationUtil } from "@/shared/utils/pagination/pagination.util";
import { SortUtil } from "@/shared/utils/sort/sort.util";
import { StringUtil } from "@/shared/utils/string/string.util";

import { FindFlocksDTO } from "../../dtos/find-flock.dto";
import { FlockProps } from "../../entities/flock.props";
import { IFlockRepository } from "../flock-repository.interface";

export class InMemoryFlockRepository implements IFlockRepository {
    private flocks: FlockProps[] = [];

    async findByUID(platformUID: string, uid: string): Promise<Result<FlockProps | null>> {
        const flock =
            this.flocks.find(
                (flock) =>
                    StringUtil.equals(flock.platformUID!, platformUID) &&
                    StringUtil.equals(flock.uid, uid)
            ) ?? null;

        return ResultFactory.success(flock);
    }

    async findByName(platformUID: string, name: string): Promise<Result<FlockProps[]>> {
        const flocks = this.flocks.filter(
            (flock) => flock.platformUID === platformUID && StringUtil.equals(flock.name, name)
        );

        return ResultFactory.success(flocks);
    }

    async find(platformUID: string, filters?: FindFlocksDTO): Promise<Result<FlockProps[]>> {
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

        if (filters?.page && filters?.limit) {
            flocks = PaginationUtil.paginate(flocks, filters.page, filters.limit);
        }

        return ResultFactory.success(flocks);
    }

    async register(flock: FlockProps): Promise<Result<FlockProps>> {
        this.flocks.push(flock);

        return ResultFactory.success(flock);
    }

    async update(flock: FlockProps): Promise<Result<FlockProps>> {
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
