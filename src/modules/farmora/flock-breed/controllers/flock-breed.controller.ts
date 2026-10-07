import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";
import { isFailure } from "@/shared/result/result.guard";

import { CreateFlockBreedDTO } from "../dtos/create-flock-breed.dto";
import { FindFlockBreedsDTO } from "../dtos/find-flock-breeds.dto";
import { UpdateFlockBreedDTO } from "../dtos/update-flock-breed.dto";
import { FlockBreedUsecase } from "../usecases/flock-breed.usecase";

export class FlockBreedController {
    constructor(private readonly usecase: FlockBreedUsecase) {}

    async create(request: Request, response: Response): Promise<Response> {
        const data: CreateFlockBreedDTO = request.body;

        const result = await this.usecase.create(data);

        return resultResponse(result, response, 201);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const data: UpdateFlockBreedDTO = {
            ...request.body,
            uid: request.params.uid,
        };

        const result = await this.usecase.update(data);

        return resultResponse(result, response);
    }

    async find(request: Request, response: Response): Promise<Response> {
        const filters: FindFlockBreedsDTO = {
            flockUID: request.query.flockUID as string | undefined,

            breedUID: request.query.breedUID as string | undefined,

            minQuantity: request.query.minQuantity ? Number(request.query.minQuantity) : undefined,

            maxQuantity: request.query.maxQuantity ? Number(request.query.maxQuantity) : undefined,

            page: request.query.page ? Number(request.query.page) : undefined,

            limit: request.query.limit ? Number(request.query.limit) : undefined,

            orderBy: request.query.orderBy as FindFlockBreedsDTO["orderBy"],

            order: request.query.order as FindFlockBreedsDTO["order"],
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
