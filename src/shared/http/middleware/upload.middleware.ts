import { NextFunction, Response } from "express";
import formidable from "formidable";

import { UploadRequest } from "../types/upload-request";

export function uploadMiddleware(request: UploadRequest, response: Response, next: NextFunction) {
    const form = formidable({
        multiples: false,
        maxFiles: 1,
        maxFileSize: 10 * 1024 * 1024,
        keepExtensions: true,
    });

    form.parse(request, (error, fields, files) => {
        if (error) {
            return response.status(400).json({
                message: "Invalid file upload.",
            });
        }

        const file = files.file;

        if (!file) {
            return response.status(400).json({
                message: "File is required.",
            });
        }

        request.file = Array.isArray(file) ? file[0] : file;

        next();
    });
}
