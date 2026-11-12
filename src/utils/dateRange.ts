export function getMonthRange(month: string) {
    const parts = month.split("-");
    const year = Number(parts[0]);
    const monthNumber = Number(parts[1]);

    const start = new Date(Date.UTC(year, monthNumber - 1, 1));
    const end = new Date(Date.UTC(year, monthNumber, 1));

    return { start, end };
}
