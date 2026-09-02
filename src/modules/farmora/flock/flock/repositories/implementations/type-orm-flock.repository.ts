import { Repository } from "typeorm";

import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindFlocksDTO } from "../../dtos/find-flock.dto";
import { FlockEntity } from "../../entities/flock.entity";
import { IFlockRepository } from "../flock-repository.interface";

export class TypeORMFlockRepository implements IFlockRepository {
    constructor(private readonly flockRepository: Repository<FlockEntity>) {}

    async findByUID(platformUID: string, uid: string): Promise<Result<FlockEntity | null>> {
        const flock = await this.flockRepository.findOne({
            where: {
                uid,
                platformUID,
            },
        });

        return ResultFactory.success(flock);
    }

    async findByName(platformUID: string, name: string): Promise<Result<FlockEntity[]>> {
        const flocks = await this.flockRepository.find({
            where: {
                platformUID,
                name,
            },
        });

        return ResultFactory.success(flocks);
    }

    async find(
        platformUID: string,
        filters?: FindFlocksDTO
    ): Promise<Result<PaginationResult<FlockEntity>>> {
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const query = this.flockRepository
            .createQueryBuilder("flock")
            .where("flock.platformUID = :platformUID", {
                platformUID,
            });

        if (filters?.name) {
            query.andWhere("LOWER(flock.name) LIKE LOWER(:name)", {
                name: `%${filters.name}%`,
            });
        }

        if (filters?.status) {
            query.andWhere("flock.status = :status", {
                status: filters.status,
            });
        }

        if (filters?.minQuantity !== undefined) {
            query.andWhere("flock.quantity >= :minQuantity", {
                minQuantity: filters.minQuantity,
            });
        }

        if (filters?.maxQuantity !== undefined) {
            query.andWhere("flock.quantity <= :maxQuantity", {
                maxQuantity: filters.maxQuantity,
            });
        }

        if (filters?.orderBy) {
            query.orderBy(
                `flock.${filters.orderBy}`,
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

    async register(flock: FlockEntity): Promise<Result<FlockEntity>> {
        const savedFlock = await this.flockRepository.save(flock);

        return ResultFactory.success(savedFlock);
    }

    async update(flock: FlockEntity): Promise<Result<FlockEntity>> {
        const savedFlock = await this.flockRepository.save(flock);

        return ResultFactory.success(savedFlock);
    }

    async delete(uid: string): Promise<Result<void>> {
        await this.flockRepository.delete(uid);

        return ResultFactory.ok();
    }
}
