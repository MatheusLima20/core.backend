import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";
import { isFailure } from "@/shared/result/result.guard";

import { CreateWeightDTO } from "../dtos/create-weight.dto";
import { FindWeightsDTO } from "../dtos/find-weights.dto";
import { UpdateWeightDTO } from "../dtos/update-weight.dto";
import { WeightUsecase } from "../usecases/weight.usecase";

export class WeightController {
    constructor(private readonly usecase: WeightUsecase) {}

    async create(request: Request, response: Response): Promise<Response> {
        const data: CreateWeightDTO = request.body;

        const result = await this.usecase.create(data);

        return resultResponse(result, response, 201);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const data: UpdateWeightDTO = {
            ...request.body,
            uid: request.params.uid,
        };

        const result = await this.usecase.update(data);

        return resultResponse(result, response);
    }

    async find(request: Request, response: Response): Promise<Response> {
        const filters: FindWeightsDTO = {
            flockUID: request.query.flockUID as string | undefined,

            weighingDate: request.query.weighingDate
                ? new Date(request.query.weighingDate as string)
                : undefined,

            startDate: request.query.startDate
                ? new Date(request.query.startDate as string)
                : undefined,

            endDate: request.query.endDate ? new Date(request.query.endDate as string) : undefined,

            page: request.query.page ? Number(request.query.page) : undefined,

            limit: request.query.limit ? Number(request.query.limit) : undefined,

            orderBy: request.query.orderBy as FindWeightsDTO["orderBy"],

            order: request.query.order as FindWeightsDTO["order"],
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
