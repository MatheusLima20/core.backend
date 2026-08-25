import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";

import { CreatePlatformOwnerDTO } from "../dtos/create-platform-owner.dto";
import { CreatePlatformOwnerUseCase } from "../usecases/create-platform-owner.usecase";

export class OnboardingController {
    constructor(private readonly usecase: CreatePlatformOwnerUseCase) {}

    async create(request: Request, response: Response): Promise<Response> {
        const data: CreatePlatformOwnerDTO = request.body;

        const result = await this.usecase.execute(data);

        return resultResponse(result, response, 201);
    }
}
