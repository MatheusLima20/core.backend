import { Result } from "@/shared/result";

import { ITransactionContext } from "./transaction-context.interface";

export interface ITransactionManager {
    execute<T>(callback: (context: ITransactionContext) => Promise<Result<T>>): Promise<Result<T>>;
}
