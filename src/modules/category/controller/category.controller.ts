import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";

import { CreateCategoryDTO } from "../dtos/create-category.dto";
import { FindCategoriesDTO } from "../dtos/find-categories.dto";
import { UpdateCategoryDTO } from "../dtos/update-category.dto";
import { CategoryUsecase } from "../usecases/category.usecase";

export class CategoryController {
    constructor(private readonly usecase: CategoryUsecase) {}

    async create(request: Request, response: Response): Promise<Response> {
        const data: CreateCategoryDTO = request.body;

        const result = await this.usecase.create(data);

        return resultResponse(result, response, 201);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const data: UpdateCategoryDTO = {
            ...request.body,
            uid: request.params.uid,
        };

        const result = await this.usecase.update(data);

        return resultResponse(result, response);
    }

    async find(request: Request, response: Response): Promise<Response> {
        const filters: FindCategoriesDTO = {
            name: request.query.name as string | undefined,

            page: request.query.page ? Number(request.query.page) : undefined,

            limit: request.query.limit ? Number(request.query.limit) : undefined,

            orderBy: request.query.orderBy as FindCategoriesDTO["orderBy"],

            order: request.query.order as FindCategoriesDTO["order"],
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
