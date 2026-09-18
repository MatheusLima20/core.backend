import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";
import { isFailure } from "@/shared/result/result.guard";

import { CreateContentDTO } from "../dtos/create-content.dto";
import { FindContentsDTO } from "../dtos/find-contents.dto";
import { UpdateContentDTO } from "../dtos/update-content.dto";
import { ContentUsecase } from "../usecases/content.usecase";

export class ContentController {
    constructor(private readonly usecase: ContentUsecase) {}

    async create(request: Request, response: Response): Promise<Response> {
        const data: CreateContentDTO = request.body;

        const result = await this.usecase.create(data);

        return resultResponse(result, response, 201);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const data: UpdateContentDTO = {
            ...request.body,
            uid: request.params.uid,
        };

        const result = await this.usecase.update(data);

        return resultResponse(result, response);
    }

    async find(request: Request, response: Response): Promise<Response> {
        const filters: FindContentsDTO = {
            name: request.query.name as string | undefined,

            type: request.query.type as FindContentsDTO["type"],

            mimeType: request.query.mimeType as string | undefined,

            page: request.query.page ? Number(request.query.page) : undefined,

            limit: request.query.limit ? Number(request.query.limit) : undefined,

            orderBy: request.query.orderBy as FindContentsDTO["orderBy"],

            order: request.query.order as FindContentsDTO["order"],
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
