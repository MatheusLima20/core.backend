import { AppError } from "../errors/app.error";
import { Result } from "./result";
import { ResultFactory } from "./result.factory";
import { isFailure } from "./result.guard";

export class ResultMapper {
    static requireData<T>(
        result: Result<T | null>,
        error: AppError,
    ): Result<T> {
        if (isFailure(result)) {
            return result;
        }

        if (result.data == null) {
            return ResultFactory.failure(error);
        }

        return ResultFactory.success(result.data);
    }

    static map<T, R>(result: Result<T>, mapper: (value: T) => R): Result<R> {
        if (isFailure(result)) {
            return ResultFactory.failure(result.error);
        }

        return ResultFactory.success(mapper(result.data));
    }
}
