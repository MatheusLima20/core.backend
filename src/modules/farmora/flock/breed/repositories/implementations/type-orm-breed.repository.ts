import { Repository } from "typeorm";

import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindBreedsDTO } from "../../dtos/find-breed.dto";
import { BreedEntity } from "../../entities/breed.entity";
import { IBreedRepository } from "../breed-repository.interface";

export class TypeORMBreedRepository implements IBreedRepository {
    constructor(private readonly breedRepository: Repository<BreedEntity>) {}

    async findByUID(platformUID: string, uid: string): Promise<Result<BreedEntity | null>> {
        const breed = await this.breedRepository.findOne({
            where: {
                uid,
                platformUID,
            },
        });

        return ResultFactory.success(breed);
    }

    async findByName(platformUID: string, name: string): Promise<Result<BreedEntity | null>> {
        const breed = await this.breedRepository.findOne({
            where: {
                platformUID,
                name,
            },
        });

        return ResultFactory.success(breed);
    }

    async find(
        platformUID: string,
        filters?: FindBreedsDTO
    ): Promise<Result<PaginationResult<BreedEntity>>> {
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const query = this.breedRepository
            .createQueryBuilder("breed")
            .where("breed.platformUID = :platformUID", {
                platformUID,
            });

        if (filters?.name) {
            query.andWhere("LOWER(breed.name) LIKE LOWER(:name)", {
                name: `%${filters.name}%`,
            });
        }

        if (filters?.scientificName) {
            query.andWhere("LOWER(breed.scientificName) LIKE LOWER(:scientificName)", {
                scientificName: `%${filters.scientificName}%`,
            });
        }

        if (filters?.eggColor) {
            query.andWhere("breed.eggColor = :eggColor", {
                eggColor: filters.eggColor,
            });
        }

        if (filters?.breedPurpose) {
            query.andWhere("breed.breedPurpose = :breedPurpose", {
                breedPurpose: filters.breedPurpose,
            });
        }

        if (filters?.orderBy) {
            query.orderBy(
                `breed.${filters.orderBy}`,
                filters.order?.toUpperCase() === "DESC" ? "DESC" : "ASC"
            );
        }

        const total = await query.getCount();

        query.skip((page - 1) * limit).take(limit);

        const data = await query.getMany();

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        });
    }

    async register(breed: BreedEntity): Promise<Result<BreedEntity>> {
        const savedBreed = await this.breedRepository.save(breed);

        return ResultFactory.success(savedBreed);
    }

    async update(breed: BreedEntity): Promise<Result<BreedEntity>> {
        const savedBreed = await this.breedRepository.save(breed);

        return ResultFactory.success(savedBreed);
    }

    async delete(uid: string): Promise<Result<void>> {
        await this.breedRepository.delete(uid);

        return ResultFactory.ok();
    }
}
