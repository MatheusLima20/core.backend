import { RequestContext } from "@/shared/context/request-context";

declare global {
    namespace Express {
        interface Request {
            auth: RequestContext;
        }
    }
}

export {};
