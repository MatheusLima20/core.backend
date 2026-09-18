export abstract class AppError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode = 400) {
        super(message);

        this.name = new.target.name;
        this.statusCode = statusCode;

        Object.setPrototypeOf(this, new.target.prototype);
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
        };
    }
}

export type AppErrorClass<T extends AppError> = new (...args: any[]) => T;
