import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindBreedsDTO } from "../../dtos/find-breed.dto";
import { BreedEntity } from "../../entities/breed.entity";
import { IBreedRepository } from "../breed-repository.interface";

export class InMemoryBreedRepository implements IBreedRepository {
    private breeds: BreedEntity[] = [];

    async findByUID(platformUID: string, uid: string): Promise<Result<BreedEntity | null>> {
        const breed =
            this.breeds.find((breed) => breed.platformUID === platformUID && breed.uid === uid) ??
            null;

        return ResultFactory.success(breed);
    }

    async findByName(platformUID: string, name: string): Promise<Result<BreedEntity | null>> {
        const breed =
            this.breeds.find(
                (breed) =>
                    breed.platformUID === platformUID &&
                    breed.name.trim().toLowerCase() === name.trim().toLowerCase()
            ) ?? null;

        return ResultFactory.success(breed);
    }

    async find(
        platformUID: string,
        filters?: FindBreedsDTO
    ): Promise<Result<PaginationResult<BreedEntity>>> {
        let breeds = this.breeds.filter((breed) => breed.platformUID === platformUID);

        if (filters?.name) {
            breeds = breeds.filter((breed) =>
                breed.name.toLowerCase().includes(filters.name!.toLowerCase())
            );
        }

        if (filters?.scientificName) {
            breeds = breeds.filter((breed) =>
                breed.scientificName?.toLowerCase().includes(filters.scientificName!.toLowerCase())
            );
        }

        if (filters?.eggColor) {
            breeds = breeds.filter((breed) => breed.eggColor === filters.eggColor);
        }

        if (filters?.breedPurpose) {
            breeds = breeds.filter((breed) => breed.breedPurpose === filters.breedPurpose);
        }

        if (filters?.orderBy) {
            breeds.sort((a, b) => {
                const valueA = a[filters.orderBy!] ?? "";
                const valueB = b[filters.orderBy!] ?? "";

                if (valueA < valueB) {
                    return filters.order === "desc" ? 1 : -1;
                }

                if (valueA > valueB) {
                    return filters.order === "desc" ? -1 : 1;
                }

                return 0;
            });
        }

        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const total = breeds.length;
        const totalPages = Math.ceil(total / limit);

        const start = (page - 1) * limit;

        const data = breeds.slice(start, start + limit);

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages,
        });
    }

    async register(breed: BreedEntity): Promise<Result<BreedEntity>> {
        this.breeds.push(breed);

        return ResultFactory.success(breed);
    }

    async update(breed: BreedEntity): Promise<Result<BreedEntity>> {
        const index = this.breeds.findIndex((b) => b.uid === breed.uid);

        this.breeds[index] = breed;

        return ResultFactory.success(breed);
    }

    async delete(uid: string): Promise<Result<void>> {
        const index = this.breeds.findIndex((breed) => breed.uid === uid);

        if (index !== -1) {
            this.breeds.splice(index, 1);
        }

        return ResultFactory.success(undefined);
    }
}
