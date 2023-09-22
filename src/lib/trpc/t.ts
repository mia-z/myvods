import type { Context } from "$lib/trpc/context";
import { TRPCError, initTRPC } from "@trpc/server";
import l from "$lib/server/Logger";
import { v4 as uuid } from "uuid";
import JWT from "jsonwebtoken";
import { SECRET_JWT_SECRET } from "$env/static/private";
import prisma from "$lib/server/Prisma";

interface Meta {
    requiredPower: number
}

export const t = initTRPC
    .context<Context>()
    .meta<Meta>()
    .create({
        defaultMeta: {
            requiredPower: 0
        }
    });

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

export const authorizeContributor = t.middleware(async ({ ctx, next, meta }) => {
    if (!meta) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `NO META`,
            cause: "tRPC/Server/middleware/authorizeContributor"
        });
    }

    if (!ctx.contributorCookie) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: `NO TOKEN`,
            cause: "tRPC/Server/middleware/authorizeContributor"
        });
    }

    const verifiedToken = await JWT.verify(ctx.contributorCookie, SECRET_JWT_SECRET) as string;
    
    const validId = await prisma.contributorToken.findFirst({
        where: {
            token: verifiedToken
        },
        select: {
            contributor: {
                select: {
                    permissions: {
                        select: {
                            id: true
                        }
                    },
                    power: true
                }
            }
        }
    });

    if (validId) {
        if (validId.contributor.power >= meta.requiredPower) {
            return await next({
                ctx: {
                    ...ctx,
                    userPower: validId.contributor.power,
                    permissions: {
                        ...validId.contributor.permissions
                    }
                }
            });
        } else {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: `INVALID POWER LEVEL`,
                cause: "tRPC/Server/middleware/accessChecker"
            });
        }
    } else {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: `INVALID TOKEN`,
            cause: "tRPC/Server/middleware/authorizeContributor"
        });
    }
});

export const loggedProcedure = procedure.use(logger);

export const publicProcedure = loggedProcedure;

export const contributorProcedure = loggedProcedure;

export type Procedure = typeof t.procedure;