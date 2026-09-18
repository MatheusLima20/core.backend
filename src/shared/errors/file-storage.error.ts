import { AppError } from "@/shared/errors/app.error";

export class FileStorageError extends AppError {
    constructor(message = "Failed to upload file.") {
        super(message, 500);
    }
}
