export interface SortOptions<T> {
    items: T[];

    orderBy: keyof T;

    order?: "asc" | "desc";
}

export const SortUtil = {
    sort<T>({ items, orderBy, order = "asc" }: SortOptions<T>): T[] {
        return [...items].sort((a, b) => {
            const valueA = a[orderBy];
            const valueB = b[orderBy];

            if (valueA == null && valueB == null) return 0;
            if (valueA == null) return order === "asc" ? -1 : 1;
            if (valueB == null) return order === "asc" ? 1 : -1;

            if (valueA instanceof Date && valueB instanceof Date) {
                return order === "asc"
                    ? valueA.getTime() - valueB.getTime()
                    : valueB.getTime() - valueA.getTime();
            }

            if (typeof valueA === "string" && typeof valueB === "string") {
                const comparison = valueA.localeCompare(valueB, "pt-BR");

                return order === "asc" ? comparison : -comparison;
            }

            if (valueA < valueB) return order === "asc" ? -1 : 1;
            if (valueA > valueB) return order === "asc" ? 1 : -1;

            return 0;
        });
    },
};
