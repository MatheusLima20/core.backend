import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import { FindWeightStandardsDTO } from "../dtos/find-weight-standards.dto";
import { ResponseWeightStandardDTO } from "../dtos/response-weight-standard.dto";
import { WeightStandardMapper } from "../mappers/weight-standard.mapper";
import { IWeightStandardRepository } from "../repositories/weight-standard-repository.interface";

export class WeightStandardUsecase {
    constructor(private readonly weightStandardRepository: IWeightStandardRepository) {}

    async find(
        filters?: FindWeightStandardsDTO
    ): Promise<Result<PaginationResult<ResponseWeightStandardDTO>>> {
        const result = await this.weightStandardRepository.find(filters);

        if (isFailure(result)) {
            return ResultFactory.failure(result.error);
        }

        return ResultMapper.map(result, (pagination) => ({
            ...pagination,
            data: WeightStandardMapper.toResponseDTOList(pagination.data),
        }));
    }
}
