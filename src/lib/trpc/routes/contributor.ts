import { z } from "zod";
import prisma from "$lib/server/Prisma";
import { PUBLIC_GOOGLE_API_KEY } from "$env/static/public";
import { SECRET_JWT_SECRET } from "$env/static/private";
import { DateTime } from "luxon";
import { router, publicProcedure, contributorProcedure } from "../t";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import { ensureValidThumbnail } from "$lib/utils/YoutubeHelper";
import type { CommunityVod } from "@prisma/client";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { v4 as uuid } from "uuid";

type IntermediateVodData = Omit<CommunityVod, "communityCreatorId" | "id">;

const SALT_ROUNDS = 9;

export const contributor = router({
    createContributor: contributorProcedure
        .input(z.object({
            nick: z.string().trim().max(20).regex(/([a-zA-Z0-9])/),
            password: z.string()
        }))
        .mutation(async ({ input }) => {
            const nameExists = await prisma.communityContributor
                .count({
                    where: {
                        nick: {
                            mode: "insensitive",
                            equals: input.nick
                        }
                    }
                });
            if (nameExists > 0) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Account name already exists: " + input.nick,
                    cause: "Server/tRPC.community.createContributor/nameExists"
                });
            }
            try {
                const hash = await bcrypt.hash(input.password, SALT_ROUNDS);
                const newUser = await prisma.communityContributor
                    .create({
                        data : {
                            nick: input.nick,
                            password: hash
                        }
                    });
                return newUser.id;
            } catch (e) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Couldnt create account",
                    cause: "Server/tRPC.community.createContributor"
                });
            }
        }),
    verifyContributor: publicProcedure
        .input(z.object({
            nick: z.string(),
            password: z.string()
        }))
        .mutation(async ({ input }) => {
            const userToCompare = await prisma.communityContributor
                .findFirst({
                    where: {
                        nick: {
                            equals: input.nick,
                            mode: "insensitive"
                        }
                    }
                });
            if (!userToCompare) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Bad credentials",
                    cause: "Server/tRPC.community.verifyContributor/findFirst"
                });
            }

            try {
                const verify = await bcrypt.compare(input.password, userToCompare.password);
                if (!verify) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Bad credentials",
                        cause: "Server/tRPC.community.verifyContributor/verify"
                    });
                } else {
                    const newUuid = uuid();
                    const newContributorToken = await prisma.contributorToken
                        .create({
                            data: {
                                token: newUuid,
                                expires: DateTime.local().plus({ days: 7 }).toJSDate(),
                                contributor: {
                                    connect: {
                                        id: userToCompare.id
                                    }
                                }
                            }
                        });
                    const token = JWT.sign(newContributorToken.token, SECRET_JWT_SECRET);
                    return token;
                }
            } catch (e) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Couldnt log in",
                    cause: "Server/tRPC.community.verifyContributor/compare"
                });
            }
        }),
    createCommunityCreator: contributorProcedure
        .input(z.object({
            name: z.string()
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
    updateCommunityCreator: contributorProcedure
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
    createCommunityVod: contributorProcedure
        .input(z.object({
            video: z.string(),
            service: z.union([
                z.literal("Twitch"),
                z.literal("Youtube"),
                z.literal("Kick")
            ]),
            communityCreatorId: z.number()
        }))
        .mutation(async ({ input }) => {
            let intermediateData: IntermediateVodData;
            
            switch (input.service) {
                case "Twitch": intermediateData = await createIntermediateYoutubeData(input.video); break;
                case "Youtube": intermediateData = await createIntermediateYoutubeData(input.video); break;
                case "Kick": intermediateData = await createIntermediateKickData(input.video); break;
            }

            return await prisma.communityVod
                .create({
                    data: {
                        ...intermediateData,
                        communityCreator: {
                            connect: {
                                id: input.communityCreatorId
                            }
                        }
                    }
                })
        }),
    updateCommunityVod: contributorProcedure
        .input(z.object({
            communityVodId: z.number(),
            video: z.string(),
            service: z.union([
                z.literal("Twitch"),
                z.literal("Youtube"),
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
                        
                    }
                })
        }),
    deleteCommunityVod: contributorProcedure
        .input(z.number())
        .mutation(async ({ input }) => {
            return await prisma.communityVod
                .delete({
                    where: {
                        id: input
                    }
                })
        }),
    createCommunityVodAnnotation: contributorProcedure
        .input(z.object({
            communityVodId: z.number(),
            note: z.string().default(""),
            subject: z.string().default(""),
            game: z.string().default(""),
            timestamp: z.number()
        }))
        .mutation(async ({ input }) => {
            return await prisma.communityVodAnnotation
                .create({
                    data: {
                        note: input.note,
                        timestamp: input.timestamp,
                        game: input.game,
                        subject: input.subject,
                        communityVod: {
                            connect: {
                                id: input.communityVodId
                            }
                        }
                    }
                })
        }),
    updateCommunityVodAnnotation: contributorProcedure
        .input(z.object({
            communityVodAnnotationId: z.number(),
            note: z.string().default(""),
            subject: z.string().default(""),
            game: z.string().default(""),
            timestamp: z.number()
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
                        game: input.game,
                        subject: input.subject,
                    }
                })
        }),
    deleteCommunityVodAnnotation: contributorProcedure
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

const createIntermediateYoutubeData = async (videoIdOrUrl: string): Promise<IntermediateVodData> => {
    let videoId: string | null = videoIdOrUrl;
    if (videoId.match(/^(http(s)?:\/\/|www\.)/)) {
        const urlToExtract = new URL(videoId);
        videoId = urlToExtract.searchParams.get("v");
        if (!videoId) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Couldnt retrieve v parameter from given youtube URL",
                cause: "Server/tRPC.community.createCommunityVod/createIntermediateYoutubeData/RegEx"
            });
        }
    }

    const youtubeUrl = new URL("https://youtube.googleapis.com/youtube/v3/videos");
    youtubeUrl.searchParams.append("part", Array.from(["snippet", "contentDetails", "statistics"]).join(","));
    youtubeUrl.searchParams.append("id", videoId);
    youtubeUrl.searchParams.append("key", PUBLIC_GOOGLE_API_KEY);
    
    const youtubeRes = await axios.get<Youtube.VideoListResponse>(youtubeUrl.href, {
        validateStatus: () => true
    });

    if (youtubeRes.status === 200) {
        if (youtubeRes.data.items.length === 1) {
            return {
                videoId: youtubeRes.data.items[0].id,
                videoTitle: youtubeRes.data.items[0].snippet.title,
                videoThumbUrl: ensureValidThumbnail(youtubeRes.data.items[0].snippet.thumbnails),
                dateRecorded: youtubeRes.data.items[0].snippet.publishedAt,
                slug: youtubeRes.data.items[0].snippet.title.slice(0, 10).trim().replaceAll(/([\s\-_])+/g, "_").concat("-", youtubeRes.data.items[0].id),
                service: "Youtube",
            };
        } else {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Youtube items.length wasn't exactly one(1)",
                cause: "Server/tRPC.community.createCommunityVod/createIntermediateYoutubeData/Axios/Result"
            });
        }
    } else {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Didnt get 200 from YouTube when getting video data",
            cause: "Server/tRPC.community.createCommunityVod/createIntermediateYoutubeData/Axios"
        });
    }
}

const createIntermediateKickData = async (videoIdOrUrl: string): Promise<IntermediateVodData> => {
    let videoId: string | null = videoIdOrUrl;
    if (videoIdOrUrl.match(/^((http(s)?:\/\/)?(www\.)?)?(kick\.com\/video\/).*$/)) {
        videoId = videoIdOrUrl.split("/")[videoIdOrUrl.split("/").length - 1];
        if (!videoId) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Couldnt get id portion of kick URL",
                cause: "Server/tRPC.community.createCommunityVod/createYoutubeVodEntry/RegEx/Url"
            });
        }
    }

    if (!videoId.match(/^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/)) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Couldnt match the given kick video id\nInitial: ${videoIdOrUrl}, Parsed: ${videoId}`,
            cause: "Server/tRPC.community.createCommunityVod/createIntermediateKickData/RegEx/GUID"
        });
    }

    const kickRes = await axios.get<Kick.Video>("https://kick.com/api/v1/video/" + videoId, {
        validateStatus: () => true
    });

    if (kickRes.status === 200) {
        return {
            videoId: kickRes.data.uuid,
            videoTitle: kickRes.data.livestream.sessionTitle,
            videoThumbUrl: kickRes.data.livestream.thumbnail,
            dateRecorded: kickRes.data.livestream.createdAt.toString(),
            slug: kickRes.data.livestream.sessionTitle.slice(0, 10).trim().replaceAll(/([\s\-_])+/g, "_").concat("-", kickRes.data.id.toString()),
            service: "Kick",
        };
    } else {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Didnt get 200 from Kick when getting video data",
            cause: "Server/tRPC.community.createCommunityVod/createIntermediateKickData/Axios"
        });
    }
}
