import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";

import { FindWeightStandardsDTO } from "../dtos/find-weight-standards.dto";
import { WeightStandardEntity } from "../entities/weight-standard.entity";

export interface IWeightStandardRepository {
    find(filters?: FindWeightStandardsDTO): Promise<Result<PaginationResult<WeightStandardEntity>>>;
}
