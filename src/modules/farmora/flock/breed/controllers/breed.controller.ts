import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";

import { FindBreedsDTO } from "../dtos/find-breed.dto";
import { BreedUsecase } from "../usecases/breed.usecase";

export class BreedController {
    constructor(private readonly usecase: BreedUsecase) {}

    async find(request: Request, response: Response): Promise<Response> {
        const filters: FindBreedsDTO = {
            name: request.query.name as string | undefined,
            scientificName: request.query.scientificName as string | undefined,
            eggColor: request.query.eggColor as FindBreedsDTO["eggColor"],
            breedPurpose: request.query.breedPurpose as FindBreedsDTO["breedPurpose"],
            page: request.query.page ? Number(request.query.page) : undefined,
            limit: request.query.limit ? Number(request.query.limit) : undefined,
            orderBy: request.query.orderBy as FindBreedsDTO["orderBy"],
            order: request.query.order as FindBreedsDTO["order"],
        };

        const result = await this.usecase.find(filters);

        return resultResponse(result, response);
    }
}
