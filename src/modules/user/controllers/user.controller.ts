import { Request, Response, response } from "express";

import { resultResponse } from "@/shared/http/result-response";
import { isFailure } from "@/shared/result/result.guard";

import { CreateUserDTO } from "../dtos/create-user.dto";
import { FindUsersDTO } from "../dtos/find-users.dto";
import { UpdateUserDTO } from "../dtos/update-user.dto";
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

    async find(req: Request, res: Response): Promise<Response> {
        const result = await this.usecase.find({
            name: req.query.name as string | undefined,
            email: req.query.email as string | undefined,
            userType: req.query.userType as string | undefined,
            isActivated:
                req.query.isActivated !== undefined ? req.query.isActivated === "true" : undefined,
            page: req.query.page ? Number(req.query.page) : undefined,
            limit: req.query.limit ? Number(req.query.limit) : undefined,
            orderBy: req.query.orderBy as FindUsersDTO["orderBy"],
            order: req.query.order as FindUsersDTO["order"],
        });

        if (isFailure(result)) {
            return resultResponse(result, response);
        }

        return res.status(200).json(result.data);
    }

    async findByUID(request: Request, response: Response): Promise<Response> {
        const result = await this.usecase.findByUID(request.params.uid);

        return resultResponse(result, response);
    }

    async findByEmail(request: Request, response: Response): Promise<Response> {
        const result = await this.usecase.findByEmail(request.params.email);

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
