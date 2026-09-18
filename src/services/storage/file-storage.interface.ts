import { Result } from "@/shared/result";

export interface IFileStorage {
    upload(filepath: string, filename: string): Promise<Result<string>>;

    delete(pathname: string): Promise<Result<void>>;
}
