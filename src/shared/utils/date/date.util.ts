export const DateUtil = {
    now(): Date {
        return new Date();
    },

    addDays(date: Date, days: number): Date {
        const result = new Date(date);

        result.setDate(result.getDate() + days);

        return result;
    },

    subtractDays(date: Date, days: number): Date {
        return this.addDays(date, -days);
    },

    daysBetween(start: Date, end: Date): number {
        const millisecondsPerDay = 1000 * 60 * 60 * 24;

        const difference = end.getTime() - start.getTime();

        return Math.floor(difference / millisecondsPerDay);
    },

    isToday(date: Date): boolean {
        const today = new Date();

        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    },

    startOfDay(date: Date): Date {
        const result = new Date(date);

        result.setHours(0, 0, 0, 0);

        return result;
    },

    endOfDay(date: Date): Date {
        const result = new Date(date);

        result.setHours(23, 59, 59, 999);

        return result;
    },

    startOfMonth(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    },

    endOfMonth(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    },

    isBetween(date: Date, start: Date, end: Date): boolean {
        return date >= start && date <= end;
    },

    ageInWeeks(date: Date): number {
        return Math.floor(this.daysBetween(date, new Date()) / 7);
    },

    ageInDays(date: Date): number {
        return this.daysBetween(date, new Date());
    },
};
