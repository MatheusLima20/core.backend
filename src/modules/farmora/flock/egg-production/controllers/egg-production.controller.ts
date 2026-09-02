import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";
import { isFailure } from "@/shared/result/result.guard";

import { CreateEggProductionDTO } from "../dtos/create-egg-production.dto";
import { FindEggProductionsDTO } from "../dtos/find-egg-production.dto";
import { UpdateEggProductionDTO } from "../dtos/update-egg-production.dto";
import { EggProductionUsecase } from "../usecases/egg-production.usecase";

export class EggProductionController {
    constructor(private readonly usecase: EggProductionUsecase) {}

    async create(request: Request, response: Response): Promise<Response> {
        const data: CreateEggProductionDTO = request.body;

        const result = await this.usecase.create(data);

        return resultResponse(result, response, 201);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const data: UpdateEggProductionDTO = {
            ...request.body,
            uid: request.params.uid,
        };

        const result = await this.usecase.update(data);

        return resultResponse(result, response);
    }

    async find(request: Request, response: Response): Promise<Response> {
        const filters: FindEggProductionsDTO = {
            flockUID: request.query.flockUID as string | undefined,

            productionDate: request.query.productionDate
                ? new Date(request.query.productionDate as string)
                : undefined,

            startDate: request.query.startDate
                ? new Date(request.query.startDate as string)
                : undefined,

            endDate: request.query.endDate ? new Date(request.query.endDate as string) : undefined,

            minTotalEggs: request.query.minTotalEggs
                ? Number(request.query.minTotalEggs)
                : undefined,

            maxTotalEggs: request.query.maxTotalEggs
                ? Number(request.query.maxTotalEggs)
                : undefined,

            page: request.query.page ? Number(request.query.page) : undefined,

            limit: request.query.limit ? Number(request.query.limit) : undefined,

            orderBy: request.query.orderBy as FindEggProductionsDTO["orderBy"],

            order: request.query.order as FindEggProductionsDTO["order"],
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
