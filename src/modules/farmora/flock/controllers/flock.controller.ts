import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";
import { isFailure } from "@/shared/result/result.guard";

import { CreateFlockDTO } from "../dtos/create-flock.dto";
import { FindFlocksDTO } from "../dtos/find-flock.dto";
import { UpdateFlockDTO } from "../dtos/update-flock.dto";
import { FlockUsecase } from "../usecases/flock.usecase";

export class FlockController {
    constructor(private readonly usecase: FlockUsecase) {}

    async create(request: Request, response: Response): Promise<Response> {
        const data: CreateFlockDTO = request.body;

        const result = await this.usecase.create(data);

        return resultResponse(result, response, 201);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const data: UpdateFlockDTO = {
            ...request.body,
            uid: request.params.uid,
        };

        const result = await this.usecase.update(data);

        return resultResponse(result, response);
    }

    async find(request: Request, response: Response): Promise<Response> {
        const filters: FindFlocksDTO = {
            name: request.query.name as string | undefined,

            status: request.query.status as FindFlocksDTO["status"],

            minQuantity: request.query.minQuantity ? Number(request.query.minQuantity) : undefined,

            maxQuantity: request.query.maxQuantity ? Number(request.query.maxQuantity) : undefined,

            page: request.query.page ? Number(request.query.page) : undefined,

            limit: request.query.limit ? Number(request.query.limit) : undefined,

            orderBy: request.query.orderBy as FindFlocksDTO["orderBy"],

            order: request.query.order as FindFlocksDTO["order"],
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
