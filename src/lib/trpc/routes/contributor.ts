import { z } from "zod";
import prisma from "$lib/server/Prisma";
import { PUBLIC_GOOGLE_API_KEY } from "$env/static/public";
import { router, publicProcedure } from "../t";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";
import { TRPCError } from "@trpc/server";
import axios from "axios";

export const contributor = router({
    createCommunityCreator: publicProcedure
        .input(z.object({
            name: z.string(),
            slug: z.string().regex(/^([a-zA-Z0-_])+$/, "Name must be latin alphabet, 0 through 9, underscores and hyphens only")
        }))
        .mutation(async ({ input }) => {
            return await prisma.communityCreator
                .create({
                    data: {
                        name: input.name.trim(),
                        slug: input.name.trim().toLowerCase()
                    },
                    select: {
                        name: true
                    }
                })
        }),
    updateCommunityCreator: publicProcedure
        .input(z.object({
            communityCreatorId: z.number(),
            name: z.string()
        }))
        .mutation(async ({ input }) => {
            return await prisma.communityCreator
                .update({
                    where: {
                        id: input.communityCreatorId
                    },
                    data: {
                        name: input.name
                    }
                })
        }),
    createCommunityVod: publicProcedure
        .input(z.object({
            video: z.string(),
            service: z.union([
                z.literal("Twitch"),
                z.literal("Youtube"),
                z.literal("Rumble"),
                z.literal("Kick")
            ]),
            communityCreatorId: z.number()
        }))
        .mutation(async ({ input }) => {
            let videoId: string | null = input.video;
            if (input.video.match(/^(http(s)?:\/\/|www\.)/)) {
                const urlToExtract = new URL(input.video);
                videoId = urlToExtract.searchParams.get("v");
                if (!videoId) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Couldnt retrieve v parameter from given youtube URL",
                        cause: "Server/tRPC.community.createCommunityVod/RegEx"
                    });
                }
            }

            const youtubeUrl = new URL("https://youtube.googleapis.com/youtube/v3/videos");
            youtubeUrl.searchParams.append("part", Array.from(["snippet", "contentDetails", "statistics"]).join(","));
            youtubeUrl.searchParams.append("id", input.video);
            youtubeUrl.searchParams.append("key", PUBLIC_GOOGLE_API_KEY);
            const youtubeRes = await axios.get<Youtube.VideoListResponse>(youtubeUrl.href, {
                validateStatus: () => true
            });

            if (youtubeRes.status === 200) {
                return await prisma.communityVod
                    .create({
                        data: {
                            videoId: youtubeRes.data.items[0].id,
                            videoTitle: youtubeRes.data.items[0].snippet.title,
                            service: input.service,
                            communityCreator: {
                                connect: {
                                    id: input.communityCreatorId
                                }
                            }
                        }
                    })
            } else {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Didnt get 200 from YouTube when getting video data",
                    cause: "Server/Axios"
                });
            }
        }),
    updateCommunityVod: publicProcedure
        .input(z.object({
            communityVodId: z.number(),
            videoUrl: z.string(),
            service: z.union([
                z.literal("Twitch"),
                z.literal("Youtube"),
                z.literal("Rumble"),
                z.literal("Kick")
            ]),
        }))
        .mutation(async ({ input }) => {
            return await prisma.communityVod
                .update({
                    where: {
                        id: input.communityVodId,
                    },
                    data: {
                        service: input.service,
                        videoUrl: input.videoUrl
                    }
                })
        }),
    deleteCommunityVod: publicProcedure
        .input(z.number())
        .mutation(async ({ input }) => {
            return await prisma.communityVod
                .delete({
                    where: {
                        id: input
                    }
                })
        }),
    createCommunityVodAnnotation: publicProcedure
        .input(z.object({
            communityVodId: z.number(),
            note: z.string().default(""),
            timestamp: z.string()
        }))
        .mutation(async ({ input }) => {
            return await prisma.communityVodAnnotation
                .create({
                    data: {
                        note: input.note,
                        timestamp: input.timestamp,
                        communityVod: {
                            connect: {
                                id: input.communityVodId
                            }
                        }
                    }
                })
        }),
    updateCommunityVodAnnotation: publicProcedure
        .input(z.object({
            communityVodAnnotationId: z.number(),
            note: z.string().default(""),
            timestamp: z.string()
        }))
        .mutation(async ({ input }) => {
            return await prisma.communityVodAnnotation
                .update({
                    where: {
                        id: input.communityVodAnnotationId
                    },
                    data: {
                        note: input.note,
                        timestamp: input.timestamp,
                    }
                })
        }),
    deleteCommunityVodAnnotation: publicProcedure
        .input(z.number())
        .mutation(async ({ input }) => {
            return await prisma.communityVodAnnotation
                .delete({
                    where: {
                        id: input
                    }
                })
        })
});