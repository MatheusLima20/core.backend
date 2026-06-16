import { AppError } from "./app.error";

export class PersistenceError extends AppError {
    constructor(message = "Persistence operation failed.") {
        super(message);

        this.name = "PersistenceError";
    }
}
