import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";

import { LoginDTO } from "../dtos/login.dto";
import { LoginUsecase } from "../usecases/login.usecase";

export class AuthController {
    constructor(private readonly usecase: LoginUsecase) {}

    async login(request: Request, response: Response): Promise<Response> {
        const data: LoginDTO = request.body;

        const result = await this.usecase.execute(data.email, data.password, data.platformUID);

        return resultResponse(result, response);
    }
}
