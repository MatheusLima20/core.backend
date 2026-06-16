import { AppError } from "../errors/app.error";
import { Result } from "../result";

export function expectSuccess<T>(result: Result<T>): T {
    expect(result.success).toBe(true);

    if (!result.success) {
        throw result;
    }

    return result.data;
}

export function expectFailure<E extends AppError>(
    result: Result<unknown, E>,
    type: new (...args: any[]) => E,
): E {
    expect(result.success).toBe(false);

    if (result.success) {
        throw new Error("Expected failure, but got success.");
    }

    const failure = result as { success: false; error: E };

    expect(failure.error).toBeInstanceOf(type);

    return failure.error;
}
