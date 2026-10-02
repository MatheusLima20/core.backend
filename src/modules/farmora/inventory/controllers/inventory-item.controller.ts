import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";
import { isFailure } from "@/shared/result/result.guard";

import { CreateInventoryItemDTO } from "../dtos/create-inventory-item.dto";
import { FindInventoryItemsDTO } from "../dtos/find-inventory-items.dto";
import { UpdateInventoryItemDTO } from "../dtos/update-inventory-item.dto";
import { InventoryItemUsecase } from "../usecases/inventory-item.usecase";

export class InventoryItemController {
    constructor(private readonly usecase: InventoryItemUsecase) {}

    async create(request: Request, response: Response): Promise<Response> {
        const data: CreateInventoryItemDTO = request.body;

        const result = await this.usecase.create(data);

        return resultResponse(result, response, 201);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const data: UpdateInventoryItemDTO = {
            ...request.body,
            uid: request.params.uid,
        };

        const result = await this.usecase.update(data);

        return resultResponse(result, response);
    }

    async find(request: Request, response: Response): Promise<Response> {
        const filters: FindInventoryItemsDTO = {
            name: request.query.name as string | undefined,
            category: request.query.category as string | undefined,
            unit: request.query.unit as string | undefined,
            trackStock:
                request.query.trackStock !== undefined
                    ? request.query.trackStock === "true"
                    : undefined,
            page: request.query.page ? Number(request.query.page) : undefined,
            limit: request.query.limit ? Number(request.query.limit) : undefined,
            orderBy: request.query.orderBy as FindInventoryItemsDTO["orderBy"],
            order: request.query.order as FindInventoryItemsDTO["order"],
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
