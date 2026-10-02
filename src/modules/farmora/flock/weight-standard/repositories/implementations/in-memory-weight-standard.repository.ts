import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { SortUtil } from "@/shared/utils/sort/sort.util";
import { StringUtil } from "@/shared/utils/string/string.util";

import { FindWeightStandardsDTO } from "../../dtos/find-weight-standards.dto";
import { WeightStandardEntity } from "../../entities/weight-standard.entity";
import { IWeightStandardRepository } from "../weight-standard-repository.interface";

export class InMemoryWeightStandardRepository implements IWeightStandardRepository {
    private weightStandards: WeightStandardEntity[] = [
        new WeightStandardEntity({
            uid: "wst-isa-brown-001",
            breed: "Isa Brown",
            week: 10,
            minWeight: 850,
            targetWeight: 900,
            maxWeight: 950,
            createdAt: new Date("2026-01-01"),
            updatedAt: new Date("2026-01-01"),
        }),
        new WeightStandardEntity({
            uid: "wst-isa-brown-002",
            breed: "Isa Brown",
            week: 20,
            minWeight: 1050,
            targetWeight: 1100,
            maxWeight: 1150,
            createdAt: new Date("2026-01-01"),
            updatedAt: new Date("2026-01-01"),
        }),
        new WeightStandardEntity({
            uid: "wst-isa-brown-003",
            breed: "Isa Brown",
            week: 30,
            minWeight: 1150,
            targetWeight: 1200,
            maxWeight: 1250,
            createdAt: new Date("2026-01-01"),
            updatedAt: new Date("2026-01-01"),
        }),
        new WeightStandardEntity({
            uid: "wst-novogen-tinted-001",
            breed: "Novogen Tinted",
            week: 10,
            minWeight: 800,
            targetWeight: 850,
            maxWeight: 900,
            createdAt: new Date("2026-01-01"),
            updatedAt: new Date("2026-01-01"),
        }),
        new WeightStandardEntity({
            uid: "wst-novogen-tinted-002",
            breed: "Novogen Tinted",
            week: 20,
            minWeight: 1000,
            targetWeight: 1050,
            maxWeight: 1100,
            createdAt: new Date("2026-01-01"),
            updatedAt: new Date("2026-01-01"),
        }),
        new WeightStandardEntity({
            uid: "wst-novogen-tinted-003",
            breed: "Novogen Tinted",
            week: 30,
            minWeight: 1100,
            targetWeight: 1150,
            maxWeight: 1200,
            createdAt: new Date("2026-01-01"),
            updatedAt: new Date("2026-01-01"),
        }),
    ];

    async find(
        filters?: FindWeightStandardsDTO
    ): Promise<Result<PaginationResult<WeightStandardEntity>>> {
        let weightStandards = [...this.weightStandards];

        if (filters?.breed) {
            weightStandards = weightStandards.filter((weightStandard) =>
                StringUtil.equals(weightStandard.breed, filters.breed!)
            );
        }

        if (filters?.week !== undefined) {
            weightStandards = weightStandards.filter(
                (weightStandard) => weightStandard.week === filters.week
            );
        }

        if (filters?.orderBy) {
            weightStandards = SortUtil.sort({
                items: weightStandards,
                orderBy: filters.orderBy,
                order: filters.order,
            });
        }

        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const total = weightStandards.length;
        const totalPages = Math.ceil(total / limit);

        const start = (page - 1) * limit;

        const data = weightStandards.slice(start, start + limit);

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages,
        });
    }
}
