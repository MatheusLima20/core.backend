import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";
import { isFailure } from "@/shared/result/result.guard";

import { CreateUserDTO } from "../dtos/create-user.dto";
import { UpdateUserDTO } from "../dtos/update-user.dto";
import { UserType } from "../enum/user-type.enum";
import { UserUseCase } from "../usecases/user.usecase";

export class UserController {
    constructor(private readonly usecase: UserUseCase) {}

    async create(request: Request, response: Response): Promise<Response> {
        const data: CreateUserDTO = request.body;

        const result = await this.usecase.create(data);

        return resultResponse(result, response, 201);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const data: UpdateUserDTO = {
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

    async findByEmail(request: Request, response: Response): Promise<Response> {
        const result = await this.usecase.findByEmail(request.params.email);

        return resultResponse(result, response);
    }

    async findByType(request: Request, response: Response): Promise<Response> {
        const result = await this.usecase.findByType(request.params.type as UserType);

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
