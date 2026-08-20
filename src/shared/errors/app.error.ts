export abstract class AppError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode = 400) {
        super(message);

        this.name = new.target.name;
        this.statusCode = statusCode;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export type AppErrorClass<E extends AppError = AppError> = new (...args: any[]) => E;
