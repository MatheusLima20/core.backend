import { Repository } from "typeorm";

import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindNutritionDTO } from "../../dtos/find-nutrition.dto";
import { NutritionEntity } from "../../entities/nutrition.entity";
import { INutritionRepository } from "../nutrition-repository.interface";

export class TypeORMNutritionRepository implements INutritionRepository {
    constructor(private readonly nutritionRepository: Repository<NutritionEntity>) {}

    async findByUID(uid: string): Promise<Result<NutritionEntity | null>> {
        const nutrition = await this.nutritionRepository.findOne({
            where: {
                uid,
            },
        });

        return ResultFactory.success(nutrition);
    }

    async find(filters?: FindNutritionDTO): Promise<Result<PaginationResult<NutritionEntity>>> {
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const query = this.nutritionRepository.createQueryBuilder("nutrition");

        if (filters?.name) {
            query.andWhere("nutrition.name ILIKE :name", {
                name: `%${filters.name}%`,
            });
        }

        if (filters?.startWeek !== undefined) {
            query.andWhere("nutrition.startWeek >= :startWeek", {
                startWeek: filters.startWeek,
            });
        }

        if (filters?.endWeek !== undefined) {
            query.andWhere("nutrition.endWeek <= :endWeek", {
                endWeek: filters.endWeek,
            });
        }

        if (filters?.orderBy) {
            query.orderBy(
                `nutrition.${filters.orderBy}`,
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

    async findByWeek(week: number): Promise<Result<NutritionEntity | null>> {
        const nutrition = await this.nutritionRepository
            .createQueryBuilder("nutrition")
            .where("nutrition.startWeek <= :week", {
                week,
            })
            .andWhere("nutrition.endWeek >= :week", {
                week,
            })
            .getOne();

        return ResultFactory.success(nutrition);
    }
}
