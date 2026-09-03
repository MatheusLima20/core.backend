import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { SortUtil } from "@/shared/utils/sort/sort.util";
import { StringUtil } from "@/shared/utils/string/string.util";

import { FindNutritionDTO } from "../../dtos/find-nutrition.dto";
import { NutritionEntity } from "../../entities/nutrition.entity";
import { INutritionRepository } from "../nutrition-repository.interface";

export class InMemoryNutritionRepository implements INutritionRepository {
    private nutritious: NutritionEntity[] = [
        new NutritionEntity({
            uid: "nutrition-1",

            name: "Inicial",

            startWeek: 1,
            endWeek: 6,

            minimumCrudeProtein: 20,
            maximumCrudeProtein: 22,

            createdAt: new Date(),
            updatedAt: new Date(),
        }),
        new NutritionEntity({
            uid: "nutrition-2",

            name: "Crescimento",

            startWeek: 7,
            endWeek: 12,

            minimumCrudeProtein: 18,
            maximumCrudeProtein: 20,

            createdAt: new Date(),
            updatedAt: new Date(),
        }),
        new NutritionEntity({
            uid: "nutrition-3",

            name: "Desenvolvimento",

            startWeek: 13,
            endWeek: 18,

            minimumCrudeProtein: 16,
            maximumCrudeProtein: 18,

            createdAt: new Date(),
            updatedAt: new Date(),
        }),
        new NutritionEntity({
            uid: "nutrition-4",

            name: "Postura",

            startWeek: 19,
            endWeek: 80,

            minimumCrudeProtein: 16,
            maximumCrudeProtein: 18,

            calcium: 3.9,

            createdAt: new Date(),
            updatedAt: new Date(),
        }),
    ];

    async findByUID(uid: string): Promise<Result<NutritionEntity | null>> {
        const nutrition = this.nutritious.find((item) => StringUtil.equals(item.uid, uid)) ?? null;

        return ResultFactory.success(nutrition);
    }

    async find(filters?: FindNutritionDTO): Promise<Result<PaginationResult<NutritionEntity>>> {
        let nutritious = [...this.nutritious];

        if (filters?.name) {
            nutritious = nutritious.filter((item) =>
                StringUtil.equalsIgnoreCase(item.name, filters.name!)
            );
        }

        if (filters?.startWeek !== undefined) {
            nutritious = nutritious.filter((item) => item.startWeek === filters.startWeek);
        }

        if (filters?.endWeek !== undefined) {
            nutritious = nutritious.filter((item) => item.endWeek === filters.endWeek);
        }

        if (filters?.orderBy) {
            nutritious = SortUtil.sort({
                items: nutritious,
                orderBy: filters.orderBy,
                order: filters.order,
            });
        }

        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const total = nutritious.length;
        const totalPages = Math.ceil(total / limit);

        const start = (page - 1) * limit;

        const data = nutritious.slice(start, start + limit);

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages,
        });
    }

    async findByWeek(week: number): Promise<Result<NutritionEntity | null>> {
        const nutrition =
            this.nutritious.find((item) => item.startWeek <= week && item.endWeek >= week) ?? null;

        return ResultFactory.success(nutrition);
    }
}
