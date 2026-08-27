import crypto from "node:crypto";

interface IBaseEntity {
    uid?: string;
    prefix: string;
}

export abstract class BaseEntity {
    uid!: string;
    prefix: string;

    constructor(props: IBaseEntity) {
        this.prefix = `${props.prefix}_`;
        this.uid = props.uid ?? this.generateId();
    }

    protected generateId(): string {
        return `${this.prefix}${crypto.randomUUID()}`;
    }
}
