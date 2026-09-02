import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";
import { isFailure } from "@/shared/result/result.guard";

import { CreateMortalityDTO } from "../dtos/create-mortality.dto";
import { FindMortalitiesDTO } from "../dtos/find-mortality.dto";
import { UpdateMortalityDTO } from "../dtos/update-mortality.dto";
import { MortalityUsecase } from "../usecases/mortality.usecase";

export class MortalityController {
    constructor(private readonly usecase: MortalityUsecase) {}

    async create(request: Request, response: Response): Promise<Response> {
        const data: CreateMortalityDTO = request.body;

        const result = await this.usecase.create(data);

        return resultResponse(result, response, 201);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const data: UpdateMortalityDTO = {
            ...request.body,
            uid: request.params.uid,
        };

        const result = await this.usecase.update(data);

        return resultResponse(result, response);
    }

    async find(request: Request, response: Response): Promise<Response> {
        const filters: FindMortalitiesDTO = {
            flockUID: request.query.flockUID as string | undefined,

            mortalityDate: request.query.mortalityDate
                ? new Date(request.query.mortalityDate as string)
                : undefined,

            startDate: request.query.startDate
                ? new Date(request.query.startDate as string)
                : undefined,

            endDate: request.query.endDate ? new Date(request.query.endDate as string) : undefined,

            cause: request.query.cause as FindMortalitiesDTO["cause"],

            minQuantity: request.query.minQuantity ? Number(request.query.minQuantity) : undefined,

            maxQuantity: request.query.maxQuantity ? Number(request.query.maxQuantity) : undefined,

            page: request.query.page ? Number(request.query.page) : undefined,

            limit: request.query.limit ? Number(request.query.limit) : undefined,

            orderBy: request.query.orderBy as FindMortalitiesDTO["orderBy"],

            order: request.query.order as FindMortalitiesDTO["order"],
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
