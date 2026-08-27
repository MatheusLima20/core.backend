import { Result } from "@/shared/result";

import { ITransactionContext } from "../transaction-context.interface";
import { ITransactionManager } from "../transaction-manager.interface";

export class FakeTransactionManager implements ITransactionManager {
    constructor(private readonly context: ITransactionContext) {}

    async execute<T>(
        callback: (context: ITransactionContext) => Promise<Result<T>>
    ): Promise<Result<T>> {
        return callback(this.context);
    }
}
