import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";

import { CreateProductDTO } from "../dtos/create-product.dto";
import { FindProductsDTO } from "../dtos/find-products.dto";
import { UpdateProductDTO } from "../dtos/update-product.dto";
import { ProductUsecase } from "../usecases/product.usecase";

export class ProductController {
    constructor(private readonly usecase: ProductUsecase) {}

    async create(request: Request, response: Response): Promise<Response> {
        const data: CreateProductDTO = request.body;

        const result = await this.usecase.create(data);

        return resultResponse(result, response, 201);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const data: UpdateProductDTO = {
            ...request.body,
            uid: request.params.uid,
        };

        const result = await this.usecase.update(data);

        return resultResponse(result, response);
    }

    async find(request: Request, response: Response): Promise<Response> {
        const filters: FindProductsDTO = {
            categoryUID: request.query.categoryUID as string | undefined,

            name: request.query.name as string | undefined,

            page: request.query.page ? Number(request.query.page) : undefined,

            limit: request.query.limit ? Number(request.query.limit) : undefined,

            orderBy: request.query.orderBy as FindProductsDTO["orderBy"],

            order: request.query.order as FindProductsDTO["order"],
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
