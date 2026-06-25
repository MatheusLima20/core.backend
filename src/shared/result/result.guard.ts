import { FailureResult, Result } from "./result";

export function isFailure<T, E>(result: Result<T, E>): result is FailureResult<E> {
    return result.success === false;
}
