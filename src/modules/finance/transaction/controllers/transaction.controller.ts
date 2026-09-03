import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";
import { isFailure } from "@/shared/result/result.guard";

import { CreateTransactionDTO } from "../dtos/create-transaction.dto";
import { FindTransactionsDTO } from "../dtos/find-transaction.dto";
import { UpdateTransactionDTO } from "../dtos/update-transaction.dto";
import { TransactionUsecase } from "../usecases/transaction.usecase";

export class TransactionController {
    constructor(private readonly usecase: TransactionUsecase) {}

    async create(request: Request, response: Response): Promise<Response> {
        const data: CreateTransactionDTO = {
            ...request.body,
            occurredAt: new Date(request.body.occurredAt),
        };

        const result = await this.usecase.create(data);

        return resultResponse(result, response, 201);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const data: UpdateTransactionDTO = {
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
        const filters: FindTransactionsDTO = {
            categoryUID: request.query.categoryUID as string | undefined,

            type: request.query.type as FindTransactionsDTO["type"],

            source: request.query.source as FindTransactionsDTO["source"],

            sourceUID: request.query.sourceUID as string | undefined,

            occurredAtStart: request.query.occurredAtStart
                ? new Date(request.query.occurredAtStart as string)
                : undefined,

            occurredAtEnd: request.query.occurredAtEnd
                ? new Date(request.query.occurredAtEnd as string)
                : undefined,

            minAmount:
                request.query.minAmount !== undefined ? Number(request.query.minAmount) : undefined,

            maxAmount:
                request.query.maxAmount !== undefined ? Number(request.query.maxAmount) : undefined,

            page: request.query.page !== undefined ? Number(request.query.page) : undefined,

            limit: request.query.limit !== undefined ? Number(request.query.limit) : undefined,

            orderBy: request.query.orderBy as FindTransactionsDTO["orderBy"],

            order: request.query.order as FindTransactionsDTO["order"],
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
