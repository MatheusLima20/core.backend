import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";

import { CreateStockDTO } from "../dtos/create-stock.dto";
import { FindStocksDTO } from "../dtos/find-stocks.dto";
import { UpdateStockDTO } from "../dtos/update-stock.dto";
import { StockUsecase } from "../usecases/stock.usecase";

export class StockController {
    constructor(private readonly usecase: StockUsecase) {}

    async create(request: Request, response: Response): Promise<Response> {
        const data: CreateStockDTO = request.body;

        const result = await this.usecase.create(data);

        return resultResponse(result, response, 201);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const data: UpdateStockDTO = {
            ...request.body,
            uid: request.params.uid,
        };

        const result = await this.usecase.update(data);

        return resultResponse(result, response);
    }

    async find(request: Request, response: Response): Promise<Response> {
        const filters: FindStocksDTO = {
            productUID: request.query.productUID as string | undefined,

            page: request.query.page ? Number(request.query.page) : undefined,

            limit: request.query.limit ? Number(request.query.limit) : undefined,

            orderBy: request.query.orderBy as FindStocksDTO["orderBy"],

            order: request.query.order as FindStocksDTO["order"],
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

        if (!result.success) {
            return resultResponse(result, response);
        }

        return response.status(204).send();
    }
}
