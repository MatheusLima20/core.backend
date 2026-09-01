import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";
import { isFailure } from "@/shared/result/result.guard";

import { CreateBreedDTO } from "../dtos/create-breed.dto";
import { FindBreedsDTO } from "../dtos/find-breed.dto";
import { UpdateBreedDTO } from "../dtos/update-breed.dto";
import { BreedUsecase } from "../usecases/breed.usecase";

export class BreedController {
    constructor(private readonly usecase: BreedUsecase) {}

    async create(request: Request, response: Response): Promise<Response> {
        const data: CreateBreedDTO = request.body;

        const result = await this.usecase.create(data);

        return resultResponse(result, response, 201);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const data: UpdateBreedDTO = {
            ...request.body,
            uid: request.params.uid,
        };

        const result = await this.usecase.update(data);

        return resultResponse(result, response);
    }

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

    async findByUID(request: Request, response: Response): Promise<Response> {
        const result = await this.usecase.findByUID(request.params.uid);

        return resultResponse(result, response);
    }

    async delete(request: Request, response: Response): Promise<Response> {
        const result = await this.usecase.delete(request.params.uid);

        if (isFailure(result)) {
            return resultResponse(result, response);
        }

        return response.status(204).send();
    }
}
