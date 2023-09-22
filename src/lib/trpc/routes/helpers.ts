import { z } from "zod";
import prisma from "$lib/server/Prisma";
import { router, publicProcedure } from "../t";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";
import { TRPCError } from "@trpc/server";
import { PUBLIC_GOOGLE_API_KEY } from "$env/static/public";
import axios, { AxiosError } from "axios";
import logger from "$lib/server/Logger";

export const helpers = router({
    getYoutubeVideoData: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
            let videoId: string | null = input;
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

            try {
                const youtubeRes = await axios.get<Youtube.VideoListResponse>(youtubeUrl.href);

                if (youtubeRes.data.items.length !== 1) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Items list received from Youtube wasn't exactly 1 (One)",
                        cause: "Server/tRPC.helpers.getYoutubeVideoData/data"
                    });
                } else {
                    return youtubeRes.data.items[0];
                }
            } catch (e) {
                if (e instanceof AxiosError) {
                    logger.error({ source: "Server/tRPC.helpers.getYoutubeVideoData/axios", text: `Axios result wasn't 200 - ${e.code}: ${e.message}, ${e.cause}` });
                }
                if (e instanceof TRPCError) {
                    logger.error({ source: "Server/tRPC.helpers.getYoutubeVideoData/tRPC", text: `tRPC Error - ${e.code}: ${e.message}` });
                }
            }
        })
});