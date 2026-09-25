type DateInput = Date | string;

function toDate(value: DateInput): Date {
    if (value instanceof Date) {
        return new Date(value);
    }

    const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (dateOnly) {
        const [, year, month, day] = dateOnly;

        return new Date(Number(year), Number(month) - 1, Number(day));
    }

    const result = new Date(value);

    if (Number.isNaN(result.getTime())) {
        throw new Error(`Invalid date: ${value}`);
    }

    return result;
}

export const DateUtil = {
    now(): Date {
        return new Date();
    },

    toDate(value: DateInput): Date {
        return toDate(value);
    },

    addDays(date: DateInput, days: number): Date {
        const result = toDate(date);

        result.setDate(result.getDate() + days);

        return result;
    },

    subtractDays(date: DateInput, days: number): Date {
        return this.addDays(date, -days);
    },

    daysBetween(start: DateInput, end: DateInput): number {
        const startDate = toDate(start);
        const endDate = toDate(end);

        const millisecondsPerDay = 1000 * 60 * 60 * 24;

        const difference = endDate.getTime() - startDate.getTime();

        return Math.floor(difference / millisecondsPerDay);
    },

    isToday(date: DateInput): boolean {
        const value = toDate(date);
        const today = new Date();

        return (
            value.getDate() === today.getDate() &&
            value.getMonth() === today.getMonth() &&
            value.getFullYear() === today.getFullYear()
        );
    },

    startOfDay(date: DateInput): Date {
        const result = toDate(date);

        result.setHours(0, 0, 0, 0);

        return result;
    },

    endOfDay(date: DateInput): Date {
        const result = toDate(date);

        result.setHours(23, 59, 59, 999);

        return result;
    },

    startOfMonth(date: DateInput): Date {
        const value = toDate(date);

        return new Date(value.getFullYear(), value.getMonth(), 1);
    },

    endOfMonth(date: DateInput): Date {
        const value = toDate(date);

        return new Date(value.getFullYear(), value.getMonth() + 1, 0, 23, 59, 59, 999);
    },

    isBetween(date: DateInput, start: DateInput, end: DateInput): boolean {
        const value = toDate(date);
        const startDate = toDate(start);
        const endDate = toDate(end);

        return value >= startDate && value <= endDate;
    },

    ageInWeeks(date: DateInput): number {
        return Math.floor(this.daysBetween(date, new Date()) / 7);
    },

    ageInDays(date: DateInput): number {
        return this.daysBetween(date, new Date());
    },

    isSameDay(dateA: DateInput, dateB: DateInput): boolean {
        const valueA = toDate(dateA);
        const valueB = toDate(dateB);

        return (
            valueA.getFullYear() === valueB.getFullYear() &&
            valueA.getMonth() === valueB.getMonth() &&
            valueA.getDate() === valueB.getDate()
        );
    },

    isBefore(dateA: DateInput, dateB: DateInput): boolean {
        return toDate(dateA).getTime() < toDate(dateB).getTime();
    },

    isAfter(dateA: DateInput, dateB: DateInput): boolean {
        return toDate(dateA).getTime() > toDate(dateB).getTime();
    },

    differenceInDays(dateA: DateInput, dateB: DateInput): number {
        const valueA = toDate(dateA);
        const valueB = toDate(dateB);

        const millisecondsPerDay = 1000 * 60 * 60 * 24;

        return Math.floor(Math.abs(valueA.getTime() - valueB.getTime()) / millisecondsPerDay);
    },
};
