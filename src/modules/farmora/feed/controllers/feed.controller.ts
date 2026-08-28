import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";
import { isFailure } from "@/shared/result/result.guard";

import { CreateFeedDTO } from "../dtos/create-feed.dto";
import { FindFeedsDTO } from "../dtos/find-feeds.dto";
import { UpdateFeedDTO } from "../dtos/update-feed.dto";
import { FeedUsecase } from "../usecases/feed.usecase";

export class FeedController {
    constructor(private readonly usecase: FeedUsecase) {}

    async create(request: Request, response: Response): Promise<Response> {
        const data: CreateFeedDTO = request.body;

        const result = await this.usecase.create(data);

        return resultResponse(result, response, 201);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const data: UpdateFeedDTO = {
            ...request.body,
            uid: request.params.uid,
        };

        const result = await this.usecase.update(data);

        return resultResponse(result, response);
    }

    async find(request: Request, response: Response): Promise<Response> {
        const filters: FindFeedsDTO = {
            name: request.query.name as string | undefined,
            page: request.query.page ? Number(request.query.page) : undefined,
            limit: request.query.limit ? Number(request.query.limit) : undefined,
            orderBy: request.query.orderBy as FindFeedsDTO["orderBy"],
            order: request.query.order as FindFeedsDTO["order"],
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

    async deleteItems(request: Request, response: Response): Promise<Response> {
        const result = await this.usecase.deleteItems(request.params.uid, request.body.itemUIDs);

        if (isFailure(result)) {
            return resultResponse(result, response);
        }

        return response.status(204).send();
    }
}
