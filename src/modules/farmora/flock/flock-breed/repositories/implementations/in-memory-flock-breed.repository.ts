import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { SortUtil } from "@/shared/utils/sort/sort.util";
import { StringUtil } from "@/shared/utils/string/string.util";

import { FindFlockBreedsDTO } from "../../dtos/find-flock-breeds.dto";
import { FlockBreedEntity } from "../../entities/flock-breed.entity";
import { IFlockBreedRepository } from "../flock-breed-repository.interface";

export class InMemoryFlockBreedRepository implements IFlockBreedRepository {
    private flockBreeds: FlockBreedEntity[] = [];

    async findByUID(platformUID: string, uid: string): Promise<Result<FlockBreedEntity | null>> {
        const flockBreed =
            this.flockBreeds.find(
                (item) =>
                    StringUtil.equals(item.platformUID, platformUID) &&
                    StringUtil.equals(item.uid, uid)
            ) ?? null;

        return ResultFactory.success(flockBreed);
    }

    async findByFlockAndBreed(
        platformUID: string,
        flockUID: string,
        breedUID: string
    ): Promise<Result<FlockBreedEntity | null>> {
        const flockBreed =
            this.flockBreeds.find(
                (item) =>
                    StringUtil.equals(item.platformUID, platformUID) &&
                    StringUtil.equals(item.flockUID, flockUID) &&
                    StringUtil.equals(item.breedUID, breedUID)
            ) ?? null;

        return ResultFactory.success(flockBreed);
    }

    async find(
        platformUID: string,
        filters?: FindFlockBreedsDTO
    ): Promise<Result<PaginationResult<FlockBreedEntity>>> {
        let flockBreeds = this.flockBreeds.filter((item) =>
            StringUtil.equals(item.platformUID, platformUID)
        );

        if (filters?.flockUID) {
            flockBreeds = flockBreeds.filter((item) =>
                StringUtil.equals(item.flockUID, filters.flockUID!)
            );
        }

        if (filters?.breedUID) {
            flockBreeds = flockBreeds.filter((item) =>
                StringUtil.equals(item.breedUID, filters.breedUID!)
            );
        }

        if (filters?.minQuantity !== undefined) {
            flockBreeds = flockBreeds.filter((item) => item.quantity >= filters.minQuantity!);
        }

        if (filters?.maxQuantity !== undefined) {
            flockBreeds = flockBreeds.filter((item) => item.quantity <= filters.maxQuantity!);
        }

        if (filters?.orderBy) {
            flockBreeds = SortUtil.sort({
                items: flockBreeds,
                orderBy: filters.orderBy,
                order: filters.order,
            });
        }

        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const total = flockBreeds.length;
        const totalPages = Math.ceil(total / limit);
        const start = (page - 1) * limit;

        const data = flockBreeds.slice(start, start + limit);

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages,
        });
    }

    async register(flockBreed: FlockBreedEntity): Promise<Result<FlockBreedEntity>> {
        this.flockBreeds.push(flockBreed);

        return ResultFactory.success(flockBreed);
    }

    async update(flockBreed: FlockBreedEntity): Promise<Result<FlockBreedEntity>> {
        const index = this.flockBreeds.findIndex((item) =>
            StringUtil.equals(item.uid, flockBreed.uid)
        );

        this.flockBreeds[index] = flockBreed;

        return ResultFactory.success(flockBreed);
    }

    async delete(uid: string): Promise<Result<void>> {
        const index = this.flockBreeds.findIndex((item) => StringUtil.equals(item.uid, uid));

        if (index !== -1) {
            this.flockBreeds.splice(index, 1);
        }

        return ResultFactory.success(undefined);
    }
}
