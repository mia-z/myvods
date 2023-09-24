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
                            
                        }
                    }
                })
        }),
    getCommunityCreatorBySlugWithVods: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
            return await prisma.communityCreator
                .findFirst({
                    where: {
                        slug: input
                    },
                    include: {
                        vods: true
                    }
                })
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
                })
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
                })
        })
});