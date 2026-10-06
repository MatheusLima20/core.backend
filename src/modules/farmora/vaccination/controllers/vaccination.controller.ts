import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";
import { isFailure } from "@/shared/result/result.guard";

import { CreateVaccinationDTO } from "../dtos/create-vaccination.dto";
import { FindVaccinationsDTO } from "../dtos/find-vaccination.dto";
import { UpdateVaccinationDTO } from "../dtos/update-vaccination.dto";
import { VaccinationUsecase } from "../usecases/vaccination.usecase";

export class VaccinationController {
    constructor(private readonly usecase: VaccinationUsecase) {}

    async create(request: Request, response: Response): Promise<Response> {
        const data: CreateVaccinationDTO = request.body;

        const result = await this.usecase.create(data);

        return resultResponse(result, response, 201);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const data: UpdateVaccinationDTO = {
            ...request.body,
            uid: request.params.uid,
        };

        const result = await this.usecase.update(data);

        return resultResponse(result, response);
    }

    async find(request: Request, response: Response): Promise<Response> {
        const filters: FindVaccinationsDTO = {
            flockUID: request.query.flockUID as string | undefined,

            itemUID: request.query.itemUID as string | undefined,

            applicationDate: request.query.applicationDate
                ? new Date(request.query.applicationDate as string)
                : undefined,

            startDate: request.query.startDate
                ? new Date(request.query.startDate as string)
                : undefined,

            endDate: request.query.endDate ? new Date(request.query.endDate as string) : undefined,

            nextDoseDate: request.query.nextDoseDate
                ? new Date(request.query.nextDoseDate as string)
                : undefined,

            page: request.query.page ? Number(request.query.page) : undefined,

            limit: request.query.limit ? Number(request.query.limit) : undefined,

            orderBy: request.query.orderBy as FindVaccinationsDTO["orderBy"],

            order: request.query.order as FindVaccinationsDTO["order"],
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
