import bcrypt from "bcrypt";

import { IHashProvider } from "../hash-provider.interface";

export class BcryptHashProvider implements IHashProvider {
    private readonly saltRounds = 10;

    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
