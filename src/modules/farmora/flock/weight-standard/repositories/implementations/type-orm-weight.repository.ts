import { Repository } from "typeorm";

import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindWeightStandardsDTO } from "../../dtos/find-weight-standards.dto";
import { WeightStandardEntity } from "../../entities/weight-standard.entity";
import { IWeightStandardRepository } from "../weight-standard-repository.interface";

export class TypeORMWeightStandardRepository implements IWeightStandardRepository {
    constructor(private readonly weightStandardRepository: Repository<WeightStandardEntity>) {}

    async find(
        filters?: FindWeightStandardsDTO
    ): Promise<Result<PaginationResult<WeightStandardEntity>>> {
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const query = this.weightStandardRepository.createQueryBuilder("weightStandard");

        if (filters?.breed) {
            query.andWhere("weightStandard.breed = :breed", {
                breed: filters.breed,
            });
        }

        if (filters?.week !== undefined) {
            query.andWhere("weightStandard.week = :week", {
                week: filters.week,
            });
        }

        if (filters?.orderBy) {
            query.orderBy(
                `weightStandard.${filters.orderBy}`,
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
}
