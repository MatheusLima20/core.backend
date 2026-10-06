import { Repository } from "typeorm";

import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindFlockBreedsDTO } from "../../dtos/find-flock-breeds.dto";
import { FlockBreedEntity } from "../../entities/flock-breed.entity";
import { IFlockBreedRepository } from "../flock-breed-repository.interface";

export class TypeORMFlockBreedRepository implements IFlockBreedRepository {
    constructor(private readonly flockBreedRepository: Repository<FlockBreedEntity>) {}

    async findByUID(platformUID: string, uid: string): Promise<Result<FlockBreedEntity | null>> {
        const flockBreed = await this.flockBreedRepository.findOne({
            where: {
                uid,
                platformUID,
            },
        });

        return ResultFactory.success(flockBreed);
    }

    async findByFlockAndBreed(
        platformUID: string,
        flockUID: string,
        breedUID: string
    ): Promise<Result<FlockBreedEntity | null>> {
        const flockBreed = await this.flockBreedRepository.findOne({
            where: {
                platformUID,
                flockUID,
                breedUID,
            },
        });

        return ResultFactory.success(flockBreed);
    }

    async find(
        platformUID: string,
        filters?: FindFlockBreedsDTO
    ): Promise<Result<PaginationResult<FlockBreedEntity>>> {
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const query = this.flockBreedRepository
            .createQueryBuilder("flockBreed")
            .where("flockBreed.platformUID = :platformUID", {
                platformUID,
            });

        if (filters?.flockUID) {
            query.andWhere("flockBreed.flockUID = :flockUID", {
                flockUID: filters.flockUID,
            });
        }

        if (filters?.breedUID) {
            query.andWhere("flockBreed.breedUID = :breedUID", {
                breedUID: filters.breedUID,
            });
        }

        if (filters?.minQuantity !== undefined) {
            query.andWhere("flockBreed.quantity >= :minQuantity", {
                minQuantity: filters.minQuantity,
            });
        }

        if (filters?.maxQuantity !== undefined) {
            query.andWhere("flockBreed.quantity <= :maxQuantity", {
                maxQuantity: filters.maxQuantity,
            });
        }

        if (filters?.orderBy) {
            query.orderBy(
                `flockBreed.${filters.orderBy}`,
                filters.order?.toUpperCase() === "DESC" ? "DESC" : "ASC"
            );
        }

        const total = await query.getCount();

        const data = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        });
    }

    async register(flockBreed: FlockBreedEntity): Promise<Result<FlockBreedEntity>> {
        const savedFlockBreed = await this.flockBreedRepository.save(flockBreed);

        return ResultFactory.success(savedFlockBreed);
    }

    async update(flockBreed: FlockBreedEntity): Promise<Result<FlockBreedEntity>> {
        const savedFlockBreed = await this.flockBreedRepository.save(flockBreed);

        return ResultFactory.success(savedFlockBreed);
    }

    async delete(uid: string): Promise<Result<void>> {
        await this.flockBreedRepository.delete(uid);

        return ResultFactory.ok();
    }
}
