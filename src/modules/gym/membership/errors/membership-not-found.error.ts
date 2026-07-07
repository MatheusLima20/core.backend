import { AppError } from "@/shared/errors/app.error";

export class MembershipNotFoundError extends AppError {
    constructor(membership: { uid?: string; name?: string }) {
        super(
            membership.uid
                ? `Membership '${membership.uid}' not found.`
                : `Membership '${membership.name}' not found.`,
        );

        this.name = "MembershipNotFoundError";
    }
}
