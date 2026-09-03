import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";
import { isFailure } from "@/shared/result/result.guard";

import { CreateTransactionCategoryDTO } from "../dtos/create-transaction-category.dto";
import { FindTransactionCategoriesDTO } from "../dtos/find-transaction-category.dto";
import { UpdateTransactionCategoryDTO } from "../dtos/update-transaction-category.dto";
import { TransactionCategoryUsecase } from "../usecases/transaction-category.usecase";

export class TransactionCategoryController {
    constructor(private readonly usecase: TransactionCategoryUsecase) {}

    async create(request: Request, response: Response): Promise<Response> {
        const data: CreateTransactionCategoryDTO = request.body;

        const result = await this.usecase.create(data);

        return resultResponse(result, response, 201);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const data: UpdateTransactionCategoryDTO = {
            ...request.body,
            uid: request.params.uid,
        };

        const result = await this.usecase.update(data);

        return resultResponse(result, response);
    }

    async find(request: Request, response: Response): Promise<Response> {
        const filters: FindTransactionCategoriesDTO = {
            name: request.query.name as string | undefined,

            type: request.query.type as FindTransactionCategoriesDTO["type"],

            page: request.query.page ? Number(request.query.page) : undefined,

            limit: request.query.limit ? Number(request.query.limit) : undefined,

            orderBy: request.query.orderBy as FindTransactionCategoriesDTO["orderBy"],

            order: request.query.order as FindTransactionCategoriesDTO["order"],
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
