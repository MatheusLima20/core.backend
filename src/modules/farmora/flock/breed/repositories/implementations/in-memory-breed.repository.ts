import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindBreedsDTO } from "../../dtos/find-breed.dto";
import { BreedProps } from "../../entities/breed.props";
import { IBreedRepository } from "../breed-repository.interface";

export class InMemoryBreedRepository implements IBreedRepository {
    private breeds: BreedProps[] = [];

    async findByUID(platformUID: string, uid: string): Promise<Result<BreedProps | null>> {
        const breed =
            this.breeds.find((breed) => breed.platformUID === platformUID && breed.uid === uid) ??
            null;

        return ResultFactory.success(breed);
    }

    async findByName(platformUID: string, name: string): Promise<Result<BreedProps | null>> {
        const breed =
            this.breeds.find(
                (breed) =>
                    breed.platformUID === platformUID &&
                    breed.name.trim().toLowerCase() === name.trim().toLowerCase()
            ) ?? null;

        return ResultFactory.success(breed);
    }

    async find(platformUID: string, filters?: FindBreedsDTO): Promise<Result<BreedProps[]>> {
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

                if (valueA < valueB) return filters.order === "desc" ? 1 : -1;

                if (valueA > valueB) return filters.order === "desc" ? -1 : 1;

                return 0;
            });
        }

        if (filters?.page && filters?.limit) {
            const start = (filters.page - 1) * filters.limit;
            const end = start + filters.limit;

            breeds = breeds.slice(start, end);
        }

        return ResultFactory.success(breeds);
    }

    async register(breed: BreedProps): Promise<Result<BreedProps>> {
        this.breeds.push(breed);

        return ResultFactory.success(breed);
    }

    async update(breed: BreedProps): Promise<Result<BreedProps>> {
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
