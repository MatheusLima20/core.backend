import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";
import { isFailure } from "@/shared/result/result.guard";

import { CreatePlatformDTO } from "../dto/create-platform.dto";
import { UpdatePlatformDTO } from "../dto/update-platform.dto";
import { PlatformUsecase } from "../usecases/platform.usecase";

export class PlatformController {
    constructor(private readonly usecase: PlatformUsecase) {}

    async create(request: Request, response: Response): Promise<Response> {
        const data: CreatePlatformDTO = request.body;

        const result = await this.usecase.create(data);

        return resultResponse(result, response, 201);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const data: UpdatePlatformDTO = {
            ...request.body,
            uid: request.params.uid,
        };

        const result = await this.usecase.update(data);

        return resultResponse(result, response);
    }

    async find(request: Request, response: Response): Promise<Response> {
        const result = await this.usecase.find();

        return resultResponse(result, response);
    }

    async findByUID(request: Request, response: Response): Promise<Response> {
        const result = await this.usecase.findByUID(request.params.uid);

        return resultResponse(result, response);
    }

    async findByName(request: Request, response: Response): Promise<Response> {
        const result = await this.usecase.findByName(request.params.name);

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
