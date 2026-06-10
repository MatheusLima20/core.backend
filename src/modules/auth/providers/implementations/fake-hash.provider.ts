import { IHashProvider } from "../hash-provider.interface";

export class FakeHashProvider implements IHashProvider {
    async hash(password: string): Promise<string> {
        return `hashed_${password}`;
    }

    async compare(password: string, hash: string): Promise<boolean> {
        return hash === `hashed_${password}`;
    }
}
