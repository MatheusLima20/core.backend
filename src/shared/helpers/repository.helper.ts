import { AppError } from "../errors/app.error";
import { Result } from "../result";
import { ResultMapper } from "../result/result.mapper";

export class RepositoryHelper {
    static requireEntity<T>(result: Result<T | null>, error: AppError) {
        return ResultMapper.requireData(result, error);
    }
}
