import { Request, Response } from "express";

import { resultResponse } from "@/shared/http/result-response";
import { UploadRequest } from "@/shared/http/types/upload-request";
import { isFailure } from "@/shared/result/result.guard";

import { CreateContentDTO } from "../dtos/create-content.dto";
import { FindContentsDTO } from "../dtos/find-contents.dto";
import { UpdateContentDTO } from "../dtos/update-content.dto";
import { UploadContentDTO } from "../dtos/upload-content.dto";
import { ContentType } from "../enums/content.type";
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

    async upload(request: UploadRequest, response: Response): Promise<Response> {
        if (!request.file) {
            return response.status(400).json({
                message: "File is required.",
            });
        }

        const mimeType = request.file.mimetype ?? "application/octet-stream";

        const data: UploadContentDTO = {
            filepath: request.file.filepath,
            originalFilename: request.file.originalFilename ?? "file",
            mimeType,
            size: request.file.size,
            type: getContentType(mimeType),
        };

        const result = await this.usecase.upload(data);

        return resultResponse(result, response, 201);
    }
}

export function getContentType(mimeType: string): ContentType {
    if (mimeType.startsWith("image/")) {
        return ContentType.IMAGE;
    }

    if (mimeType.startsWith("video/")) {
        return ContentType.VIDEO;
    }

    return ContentType.FILE;
}
