export function getPublicUrl(pathname: string): string {
    if (/^https?:\/\//i.test(pathname)) {
        return pathname;
    }

    const host = process.env.HOST ?? "localhost";
    const port = process.env.PORT ?? "3002";
    const PROTOCOL = process.env.PROTOCOL ?? "http";

    return `${PROTOCOL}://${host}:${port}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}
