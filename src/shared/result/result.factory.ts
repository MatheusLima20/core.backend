import { Result } from "./result";

export class ResultFactory {
    static success<T>(data: T): Result<T> {
        return {
            success: true,
            data,
        };
    }

    static failure<E>(error: E): Result<never, E> {
        return {
            success: false,
            error,
        };
    }

    static ok(): Result<void> {
        return {
            success: true,
            data: undefined,
        };
    }
}
