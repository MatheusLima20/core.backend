export function calculateFlockWeeks(birthDate: Date | string | null): number | null {
    if (!birthDate) {
        return null;
    }

    const date = new Date(birthDate);
    const today = new Date();

    const diff = today.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return Math.floor(days / 7);
}
