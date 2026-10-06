import { Repository } from "typeorm";

import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindMortalitiesDTO } from "../../dtos/find-mortality.dto";
import { MortalityEntity } from "../../entities/mortality.entity";
import { IMortalityRepository } from "../mortality-repository.interface";

export class TypeORMMortalityRepository implements IMortalityRepository {
    constructor(private readonly mortalityRepository: Repository<MortalityEntity>) {}

    async findByUID(platformUID: string, uid: string): Promise<Result<MortalityEntity | null>> {
        const mortality = await this.mortalityRepository.findOne({
            where: {
                uid,
                platformUID,
            },
        });

        return ResultFactory.success(mortality);
    }

    async find(
        platformUID: string,
        filters?: FindMortalitiesDTO
    ): Promise<Result<PaginationResult<MortalityEntity>>> {
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const query = this.mortalityRepository
            .createQueryBuilder("mortality")
            .where("mortality.platformUID = :platformUID", {
                platformUID,
            });

        if (filters?.flockUID) {
            query.andWhere("mortality.flockUID = :flockUID", {
                flockUID: filters.flockUID,
            });
        }

        if (filters?.mortalityDate) {
            query.andWhere("DATE(mortality.mortalityDate) = DATE(:mortalityDate)", {
                mortalityDate: filters.mortalityDate,
            });
        }

        if (filters?.startDate) {
            query.andWhere("mortality.mortalityDate >= :startDate", {
                startDate: filters.startDate,
            });
        }

        if (filters?.endDate) {
            query.andWhere("mortality.mortalityDate <= :endDate", {
                endDate: filters.endDate,
            });
        }

        if (filters?.cause) {
            query.andWhere("mortality.cause = :cause", {
                cause: filters.cause,
            });
        }

        if (filters?.minQuantity !== undefined) {
            query.andWhere("mortality.quantity >= :minQuantity", {
                minQuantity: filters.minQuantity,
            });
        }

        if (filters?.maxQuantity !== undefined) {
            query.andWhere("mortality.quantity <= :maxQuantity", {
                maxQuantity: filters.maxQuantity,
            });
        }

        if (filters?.orderBy) {
            query.orderBy(
                `mortality.${filters.orderBy}`,
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

    async register(mortality: MortalityEntity): Promise<Result<MortalityEntity>> {
        const savedMortality = await this.mortalityRepository.save(mortality);

        return ResultFactory.success(savedMortality);
    }

    async update(mortality: MortalityEntity): Promise<Result<MortalityEntity>> {
        const savedMortality = await this.mortalityRepository.save(mortality);

        return ResultFactory.success(savedMortality);
    }

    async delete(uid: string): Promise<Result<void>> {
        await this.mortalityRepository.delete(uid);

        return ResultFactory.ok();
    }
}
