import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";
import { isFailure } from "@/shared/result/result.guard";

import { CreateLossDTO } from "../dtos/create-loss.dto";
import { FindLossesDTO } from "../dtos/find-losses.dto";
import { UpdateLossDTO } from "../dtos/update-loss.dto";
import { LossUsecase } from "../usecases/loss.usecase";

export class LossController {
    constructor(private readonly usecase: LossUsecase) {}

    async create(request: Request, response: Response): Promise<Response> {
        const data: CreateLossDTO = {
            ...request.body,
            occurredAt: new Date(request.body.occurredAt),
        };

        const result = await this.usecase.create(data);

        return resultResponse(result, response, 201);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const data: UpdateLossDTO = {
            ...request.body,
            uid: request.params.uid,
            ...(request.body.occurredAt && {
                occurredAt: new Date(request.body.occurredAt),
            }),
        };

        const result = await this.usecase.update(data);

        return resultResponse(result, response);
    }

    async find(request: Request, response: Response): Promise<Response> {
        const filters: FindLossesDTO = {
            transactionUID: request.query.transactionUID as string | undefined,

            productUID: request.query.productUID as string | undefined,

            reason: request.query.reason as FindLossesDTO["reason"],

            occurredAtStart: request.query.occurredAtStart
                ? new Date(request.query.occurredAtStart as string)
                : undefined,

            occurredAtEnd: request.query.occurredAtEnd
                ? new Date(request.query.occurredAtEnd as string)
                : undefined,

            minQuantity: request.query.minQuantity ? Number(request.query.minQuantity) : undefined,

            maxQuantity: request.query.maxQuantity ? Number(request.query.maxQuantity) : undefined,

            minTotalCost: request.query.minTotalCost
                ? Number(request.query.minTotalCost)
                : undefined,

            maxTotalCost: request.query.maxTotalCost
                ? Number(request.query.maxTotalCost)
                : undefined,

            page: request.query.page ? Number(request.query.page) : undefined,

            limit: request.query.limit ? Number(request.query.limit) : undefined,

            orderBy: request.query.orderBy as FindLossesDTO["orderBy"],

            order: request.query.order as FindLossesDTO["order"],
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
