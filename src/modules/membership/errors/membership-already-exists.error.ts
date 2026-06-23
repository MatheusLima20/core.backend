import { AppError } from "@/shared/errors/app.error";

export class MembershipAlreadyExistsError extends AppError {
    constructor(name: string) {
        super(`Membership '${name}' already exists.`);

        this.name = "MembershipAlreadyExistsError";
    }
}
