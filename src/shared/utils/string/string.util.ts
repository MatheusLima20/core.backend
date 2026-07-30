export const StringUtil = {
    normalize(value?: string | null): string {
        return value?.trim().toLowerCase() ?? "";
    },

    equals(a?: string | null, b?: string | null): boolean {
        return this.normalize(a) === this.normalize(b);
    },

    noEquals(a?: string | null, b?: string | null): boolean {
        return this.normalize(a) !== this.normalize(b);
    },

    contains(text?: string | null, search?: string | null): boolean {
        return this.normalize(text).includes(this.normalize(search));
    },

    isEmpty(value?: string | null): boolean {
        return !value || value.trim().length === 0;
    },
};
