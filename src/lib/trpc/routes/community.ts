import { z } from "zod";
import prisma from "$lib/server/Prisma";
import { router, publicProcedure } from "../t";

export const community = router({
    getCommunityCreators: publicProcedure
        .query(async () => {
            return await prisma.communityCreator
                .findMany()
        }),
        getCommunityCreatorByIdWithVods: publicProcedure
        .input(z.object({
            creatorId: z.number(),
            offset: z.number().default(0)
        }))
        .query(async ({ input }) => {
            return await prisma.communityCreator
                .findFirst({
                    where: {
                        id: input.creatorId
                    },
                    include: {
                        vods: {
                            take: 9,
                            skip: input.offset * 9,
                            orderBy: {
                                dateRecorded: "desc"
                            }
                        }
                    }
                });
        }),
    getCommunityCreatorBySlug: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
            return await prisma.communityCreator
                .findFirst({
                    where: {
                        slug: input
                    }
                });
        }),
    getCommunityCreatorById: publicProcedure
        .input(z.number())
        .query(async ({ input }) => {
            return await prisma.communityCreator
                .findFirst({
                    where: {
                        id: input
                    }
                });
        }),
    getCommunityCreatorBySlugWithVods: publicProcedure
        .input(z.object({
            slug: z.string(),
            offset: z.number().default(0)
        }))
        .query(async ({ input }) => {
            return await prisma.communityCreator
                .findFirst({
                    where: {
                        slug: input.slug
                    },
                    include: {
                        vods: {
                            take: 9,
                            skip: input.offset * 9,
                            orderBy: {
                                dateRecorded: "desc"
                            }
                        }
                    }
                });
        }),
    getCommunityVodsByCreatorId: publicProcedure
        .input(z.object({
            creatorId: z.number(),
            offset: z.number().default(0)
        }))
        .query(async ({ input }) => {
            return await prisma.communityVod
                .findMany({
                    where: {
                        communityCreatorId: input.creatorId
                    },
                    take: 9,
                    skip: 9 * input.offset
                });
        }),
    getCommunityVodsByCreatorSlug: publicProcedure
        .input(z.object({
            slug: z.string(),
            offset: z.number().default(0)
        }))
        .query(async ({ input }) => {
            return await prisma.communityVod
                .findMany({
                    where: {
                        communityCreator: {
                            slug: input.slug
                        }
                    },
                    take: 9,
                    skip: 9 * input.offset
                });
        }),
    getCommunityVodByIdWithAnnotations: publicProcedure
        .input(z.number())
        .query(async ({ input }) => {
            return await prisma.communityVod
                .findFirst({
                    where: {
                        id: input
                    },
                    include: {
                        annotations: true
                    }
                });
        }),
    getCommunityVodBySlugWithAnnotations: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
            return await prisma.communityVod
                .findFirst({
                    where: {
                        slug: input
                    },
                    include: {
                        annotations: true
                    }
                });
        })
});