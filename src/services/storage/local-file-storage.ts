import { mkdir, rename, unlink } from "node:fs/promises";
import path from "node:path";

import { FileStorageError } from "@/shared/errors/file-storage.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { IFileStorage } from "./file-storage.interface";

export class LocalFileStorage implements IFileStorage {
    private readonly directory = path.resolve("uploads");

    async upload(filepath: string, filename: string): Promise<Result<string>> {
        try {
            await mkdir(this.directory, { recursive: true });

            const filePath = path.join(this.directory, filename);

            await rename(filepath, filePath);

            return ResultFactory.success(`/uploads/${filename}`);
        } catch {
            return ResultFactory.failure(new FileStorageError("Failed to upload file."));
        }
    }

    async delete(pathname: string): Promise<Result<void>> {
        try {
            const filePath = path.resolve(pathname.startsWith("/") ? `.${pathname}` : pathname);

            await unlink(filePath);

            return ResultFactory.ok();
        } catch {
            return ResultFactory.failure(new FileStorageError("Failed to delete file."));
        }
    }
}
