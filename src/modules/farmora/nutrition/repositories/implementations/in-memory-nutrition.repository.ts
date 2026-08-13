import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { PaginationUtil } from "@/shared/utils/pagination/pagination.util";
import { SortUtil } from "@/shared/utils/sort/sort.util";
import { StringUtil } from "@/shared/utils/string/string.util";

import { FindNutritionDTO } from "../../dtos/find-nutrition.dto";
import { NutritionProps } from "../../entities/nutrition.props";
import { INutritionRepository } from "../nutrition-repository.interface";

export class InMemoryNutritionRepository implements INutritionRepository {
    private nutritious: NutritionProps[] = [
        {
            uid: "nutrition-1",

            name: "Inicial",

            startWeek: 1,
            endWeek: 6,

            minimumCrudeProtein: 20,
            maximumCrudeProtein: 22,

            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            uid: "nutrition-2",

            name: "Crescimento",

            startWeek: 7,
            endWeek: 12,

            minimumCrudeProtein: 18,
            maximumCrudeProtein: 20,

            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            uid: "nutrition-3",

            name: "Desenvolvimento",

            startWeek: 13,
            endWeek: 18,

            minimumCrudeProtein: 16,
            maximumCrudeProtein: 18,

            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            uid: "nutrition-4",

            name: "Postura",

            startWeek: 19,
            endWeek: 80,

            minimumCrudeProtein: 16,
            maximumCrudeProtein: 18,

            calcium: 3.9,

            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    async findByUID(uid: string): Promise<Result<NutritionProps | null>> {
        const nutrition = this.nutritious.find((item) => StringUtil.equals(item.uid, uid)) ?? null;

        return ResultFactory.success(nutrition);
    }

    async find(filters?: FindNutritionDTO): Promise<Result<NutritionProps[]>> {
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

        if (filters?.page && filters?.limit) {
            nutritious = PaginationUtil.paginate(nutritious, filters.page, filters.limit);
        }

        return ResultFactory.success(nutritious);
    }

    async findByWeek(week: number): Promise<Result<NutritionProps | null>> {
        const nutrition =
            this.nutritious.find((item) => item.startWeek <= week && item.endWeek >= week) ?? null;

        return ResultFactory.success(nutrition);
    }
}
