import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";

import { FindWeightStandardsDTO } from "../dtos/find-weight-standards.dto";
import { WeightStandardUsecase } from "../usecases/weight-standard.usecase";

export class WeightStandardController {
    constructor(private readonly usecase: WeightStandardUsecase) {}

    async find(request: Request, response: Response): Promise<Response> {
        const filters: FindWeightStandardsDTO = {
            breed: request.query.breed ? String(request.query.breed) : undefined,

            week: request.query.week ? Number(request.query.week) : undefined,

            orderBy: request.query.orderBy as FindWeightStandardsDTO["orderBy"],

            order: request.query.order as FindWeightStandardsDTO["order"],

            page: request.query.page ? Number(request.query.page) : undefined,

            limit: request.query.limit ? Number(request.query.limit) : undefined,
        };

        const result = await this.usecase.find(filters);

        return resultResponse(result, response);
    }
}
