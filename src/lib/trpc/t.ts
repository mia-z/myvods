import type { Context } from "$lib/trpc/context";
import { initTRPC } from "@trpc/server";
import l from "$lib/server/Logger";
import { v4 as uuid } from "uuid";
export const t = initTRPC.context<Context>().create();

export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;

const logger = t.middleware(async ({ path, type, next }) => {
    const start = Date.now();
    const id = uuid();
    l.info({ source: "tRPC", text: `Received tRPC call to [${path}] [${id}]` });
    const res = await next();
    const ms = Date.now() - start;
    if (res.ok) {
        l.info({ source: "tRPC", text: `Finished tRPC call to [${path}] [${id}] after ${ms}ms` });
    } else {
        l.error({ source: "tRPC", text: `Error with tRPC call [${id}] - ${type} ${path}` });
    }
    return res;
});

export const publicProcedure = procedure.use(logger);

export type Procedure = typeof t.procedure;