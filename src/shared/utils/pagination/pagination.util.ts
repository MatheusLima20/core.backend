export const PaginationUtil = {
    paginate<T>(items: T[], page?: number, limit?: number): T[] {
        if (!page || !limit) {
            return items;
        }

        const start = (page - 1) * limit;

        return items.slice(start, start + limit);
    },
};
