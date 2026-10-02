import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";

import { FindNutritionDTO } from "../dtos/find-nutrition.dto";
import { NutritionUsecase } from "../usecases/nutrition.usecase";

export class NutritionController {
    constructor(private readonly usecase: NutritionUsecase) {}

    async find(request: Request, response: Response): Promise<Response> {
        const filters: FindNutritionDTO = {
            startWeek: request.query.startWeek ? Number(request.query.startWeek) : undefined,

            endWeek: request.query.endWeek ? Number(request.query.endWeek) : undefined,

            orderBy: request.query.orderBy as FindNutritionDTO["orderBy"],

            order: request.query.order as FindNutritionDTO["order"],

            page: request.query.page ? Number(request.query.page) : undefined,

            limit: request.query.limit ? Number(request.query.limit) : undefined,
        };

        const result = await this.usecase.find(filters);

        return resultResponse(result, response);
    }

    async findByUID(request: Request, response: Response): Promise<Response> {
        const result = await this.usecase.findByUID(request.params.uid);

        return resultResponse(result, response);
    }

    async findByWeek(request: Request, response: Response): Promise<Response> {
        const result = await this.usecase.findByWeek(Number(request.params.week));

        return resultResponse(result, response);
    }
}
