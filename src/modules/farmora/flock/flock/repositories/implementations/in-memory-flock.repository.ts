import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { SortUtil } from "@/shared/utils/sort/sort.util";
import { StringUtil } from "@/shared/utils/string/string.util";

import { IBreedRepository } from "../../../breed/repositories/breed-repository.interface";
import { FindFlocksDTO } from "../../dtos/find-flock.dto";
import { FlockEntity } from "../../entities/flock.entity";
import { FlockWithBreed } from "../../types/flock-with.breed";
import { IFlockRepository } from "../flock-repository.interface";

export class InMemoryFlockRepository implements IFlockRepository {
    constructor(private readonly breedRepository: IBreedRepository) {}

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
    ): Promise<Result<PaginationResult<FlockWithBreed>>> {
        let flocks = this.flocks.filter((flock) =>
            StringUtil.equals(flock.platformUID!, platformUID)
        );

        if (filters?.breedUID) {
            flocks = flocks.filter((flock) => StringUtil.equals(flock.breedUID, filters.breedUID!));
        }

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

        const paginatedFlocks = flocks.slice(start, start + limit);

        const data: FlockWithBreed[] = [];

        for (const flock of paginatedFlocks) {
            const breedResult = await this.breedRepository.findByUID(flock.breedUID);

            if (isFailure(breedResult)) {
                return ResultFactory.failure(breedResult.error);
            }

            const breed = breedResult.data;

            data.push({
                flock,
                breed: {
                    name: breed?.name ?? "",
                    urlImage: breed?.urlImage,
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
