import { PersistenceError } from "@/shared/errors/persistence.error";
import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import { ResponseBreedDTO } from "../dtos/breed-response.dto";
import { FindBreedsDTO } from "../dtos/find-breed.dto";
import { BreedMapper } from "../mappers/breed.mapper";
import { IBreedRepository } from "../repositories/breed-repository.interface";

export class BreedUsecase {
    constructor(private readonly breedRepository: IBreedRepository) {}

    async find(filters?: FindBreedsDTO): Promise<Result<PaginationResult<ResponseBreedDTO>>> {
        const result = await this.breedRepository.find(filters);

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch platforms."));
        }

        return ResultMapper.map(result, (pagination) => ({
            ...pagination,
            data: BreedMapper.toResponseDTOList(pagination.data),
        }));
    }

    async findByUID(uid: string): Promise<Result<ResponseBreedDTO | null>> {
        const result = await this.breedRepository.findByUID(uid);

        if (isFailure(result)) {
            return ResultFactory.success(null);
        }

        const egg = result.data;

        if (!egg) {
            return ResultFactory.success(null);
        }

        return ResultMapper.map(ResultFactory.success(egg), BreedMapper.toResponseDTO);
    }
}
