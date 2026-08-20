import { Request, Response } from "express";

import { CreatePlatformDTO } from "../dto/create-platform.dto";
import { UpdatePlatformDTO } from "../dto/update-platform.dto";
import { PlatformUsecase } from "../usecases/platform.usecase";

export class PlatformController {
    constructor(private readonly usecase: PlatformUsecase) {}

    async create(request: Request, response: Response): Promise<Response> {
        const data: CreatePlatformDTO = request.body;

        const platform = await this.usecase.create(data);

        return response.status(201).json(platform);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const data: UpdatePlatformDTO = {
            ...request.body,
            uid: request.params.uid,
        };

        const platform = await this.usecase.update(data);

        return response.status(200).json(platform);
    }

    async find(request: Request, response: Response): Promise<Response> {
        const platforms = await this.usecase.find();

        return response.status(200).json(platforms);
    }

    async findByUID(request: Request, response: Response): Promise<Response> {
        const platform = await this.usecase.findByUID(request.params.uid);

        return response.status(200).json(platform);
    }

    async findByName(request: Request, response: Response): Promise<Response> {
        const platform = await this.usecase.findByName(request.params.name);

        return response.status(200).json(platform);
    }

    async delete(request: Request, response: Response): Promise<Response> {
        await this.usecase.delete(request.params.uid);

        return response.status(204).send();
    }
}
