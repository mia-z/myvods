import { z } from "zod";
import prisma from "$lib/server/Prisma";
import { router, publicProcedure } from "../t";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";
import { TRPCError } from "@trpc/server";

export const user = router({
    getById: publicProcedure
        .input(z.number())
        .query(async ({ input }) => {
            return await prisma.user.findUnique({
                where: {
                    id: input
                },
                select: {
                    displayName: true,
                    id: true
                }
            });
        }),
    getByUUIDToken: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
            return await prisma.user.findFirstOrThrow({
                include: {
                    oauthConnections: true,
                    vods: true
                },
                where: {
                    tokens: {
                        some: {
                            token: input
                        }
                    }
                }
            })
        }),
    getByOAuthProviderId: publicProcedure
        .input(z.object({
            accountId: z.string(),
            provider: z.union([
                z.literal("TWITCH"),
                z.literal("GOOGLE")
            ])
        }))
        .query(async ({ input: { accountId, provider } }) => {
            return await prisma.oAuthConnection.findFirst({
                where: {
                    accountId,
                    AND: {
                        provider
                    }
                },
                select: {
                    user: {
                        include: {
                            oauthConnections: true,
                        }
                    }
                }
            });
        }),
    generateUserToken: publicProcedure
        .input(z.number())
        .mutation(async ({ input }) => {
            const exists = await prisma.user.findUnique({
                where: {
                    id: input
                }
            });
            if (exists) {
                const newTokenRes = await prisma.user.update({
                    where: {
                        id: input
                    },
                    data: {
                        tokens: {
                            create: {
                                expires: DateTime.now().plus({ days: 7 }).toString(),
                                token: uuid(),
                            }
                        }
                    },
                    select: {
                        tokens: {
                            orderBy: {
                                id: "desc"
                            },
                            take: 1
                        }
                    }
                });
                return newTokenRes.tokens[0].token;
            } else {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Couldnt find user associated with uuid: ${input}`,
                    cause: "Server/Prisma"
                });
            }
        }),
    createNewUserWithOAuth: publicProcedure
        .input(z.object({
            displayName: z.string().nonempty(),
            accountId: z.string().nonempty(),
            provider: z.union([
                z.literal("TWITCH"),
                z.literal("GOOGLE")
            ]),
            authCode: z.string().nonempty(),
            refreshToken: z.string().nonempty()
        }))
        .mutation(async ({ input }) => {
            return await prisma.user.create({
                data: {
                    displayName: input.displayName,
                    oauthConnections: {
                        create: {
                            accountId: input.accountId,
                            authCode: input.authCode,
                            provider: input.provider,
                            refreshToken: input.refreshToken,
                        }
                    },
                    tokens: {
                        create: {
                            token: uuid(),
                            expires: DateTime.now().plus({ days: 7 }).toString(),
                        }
                    }
                },
                select: {
                    displayName: true,
                    id: true,
                    oauthConnections: true,
                    tokens: {
                        orderBy: {
                            id: "desc"
                        },
                        take: 1
                    }
                }
            });
        }),
    linkNewOAuth: publicProcedure
        .input(z.object({
            userId: z.number(),
            accountId: z.string().nonempty(),
            provider: z.union([
                z.literal("TWITCH"),
                z.literal("GOOGLE")
            ]),
            authCode: z.string().nonempty(),
            refreshToken: z.string().nonempty()
        }))
        .mutation(async ({ input }) => {
            const newOauthRes = await prisma.user.update({
                where: {
                    id: input.userId
                },
                data: {
                    tokens: {
                        create: {
                            expires: DateTime.now().plus({ days: 7 }).toString(),
                            token: uuid(),
                        }
                    },
                    oauthConnections: {
                        create: {
                            accountId: input.accountId,
                            authCode: input.authCode,
                            provider: input.provider,
                            refreshToken: input.refreshToken,
                        }
                    }
                },
                select: {
                    displayName: true,
                    id: true,
                    oauthConnections: true,
                    tokens: {
                        orderBy: {
                            id: "desc"
                        },
                        take: 1
                    }
                }
            });
            return newOauthRes.tokens[0].token;
        }),
    removeOAuth: publicProcedure
        .input(z.object({
            userId: z.number(),
            provider: z.union([
                z.literal("TWITCH"),
                z.literal("GOOGLE")
            ]),
        }))
        .mutation(async ({ input }) => {
            const oauthToDelete = await prisma.user.findUnique({
                where: {
                    id: input.userId,
                },
                select: {
                    oauthConnections: {
                        where: {
                            provider: input.provider
                        }
                    }
                }
            });
            if (oauthToDelete && oauthToDelete.oauthConnections[0]) {
                await prisma.oAuthConnection.delete({
                    where: {
                        id: oauthToDelete.oauthConnections[0].id
                    }
                });
            } else {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Couldnt find user associated with id: ${input.userId}`,
                    cause: "Server/Prisma"
                });
            }
        }),
    changeName: publicProcedure
        .input(z.string()
            .nonempty("Must enter a value")
            .max(20, "Name must be shorted than 20 characters")
            .min(3, "Name must be longer than 2 characters")
            .regex(/^([a-zA-Z0-9])+$/, "Must only use letters and numbers")
            .trim())
        .mutation(async ({ input, ctx }) => {
            if (!ctx.userCookie) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `MISSING USER TOKEN`,
                    cause: "Server/Prisma"
                });
            }

            const user = await prisma.user.findFirst({
                include: {
                    oauthConnections: true
                },
                where: {
                    tokens: {
                        some: {
                            token: ctx.userCookie
                        }
                    }
                }
            });

            if (!user) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: `INVALID USER TOKEN`,
                    cause: "Server/Prisma"
                });
            }

            await prisma.user.update({
                where: {
                    id: user.id
                }, 
                data: {
                    displayName: input
                }
            });
        })
});