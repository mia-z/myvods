import { trpc } from "$trpc/client";
import { error, type Actions, fail } from "@sveltejs/kit";
import type { PageServerLoad, PageServerLoadEvent } from "./$types";
import { z } from "zod";
import { message, setError, superValidate } from "sveltekit-superforms/client";
import { TRPCClientError } from "@trpc/client";
import type { CommunityVod } from "@prisma/client";
import axios from "axios";
import { PUBLIC_GOOGLE_API_KEY } from "$env/static/public";
import { ensureValidThumbnail } from "$lib/utils/YoutubeHelper";

type IntermediateVodData = Omit<CommunityVod, "id">;

const newVodFormSchema = z.object({
    video: z.string().nonempty("Must enter a video ID or valid URL"),
    service: z.union([
        z.literal("Twitch"),
        z.literal("Youtube"),
        z.literal("Kick"),
        z.literal("Rumble")
    ]).default("Youtube"),
    communityCreatorId: z.number()
});

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
    const communityCreator = await trpc(event).community.getCommunityCreatorBySlug.query(event.params.communityCreatorSlug);
    
    if (communityCreator) {
        const newVodForm = await superValidate(newVodFormSchema);
        return {
            communityCreator,
            newVodForm
        };
    } else {
        throw error(404, "Community Creator Not found");
    }
}

export const actions = {
    newvod: async (event) => {
        const newVodForm = await superValidate(event.request, newVodFormSchema);

        if (!newVodForm.valid) {
            return fail(400, { newVodForm });
        }

        let intermediateVodData: IntermediateVodData;

        switch(newVodForm.data.service) {
            case "Twitch": throw new Error("Not implemented");
            case "Youtube": {
                if (newVodForm.data.video.match(/^(http(s)?:\/\/|www\.)/)) {
                    const urlToExtract = new URL(newVodForm.data.video);
                    const videoIdFromParameter = urlToExtract.searchParams.get("v");
                    if (!videoIdFromParameter) {
                        return setError(newVodForm, "video", "Couldnt parse Youtube Video ID parameter from URL");
                    } else newVodForm.data.video = videoIdFromParameter
                }

                const youtubeUrl = new URL("https://youtube.googleapis.com/youtube/v3/videos");
                youtubeUrl.searchParams.append("part", Array.from(["snippet", "contentDetails", "statistics"]).join(","));
                youtubeUrl.searchParams.append("id", newVodForm.data.video);
                youtubeUrl.searchParams.append("key", PUBLIC_GOOGLE_API_KEY);
                
                const youtubeRes = await axios.get<Youtube.VideoListResponse>(youtubeUrl.href, {
                    validateStatus: () => true
                });
                if (youtubeRes.status === 200) {
                    if (youtubeRes.data.items.length === 1) {
                        intermediateVodData = {
                            videoId: youtubeRes.data.items[0].id,
                            videoSource: "",
                            communityCreatorId: newVodForm.data.communityCreatorId,
                            videoTitle: youtubeRes.data.items[0].snippet.title,
                            videoThumbUrl: ensureValidThumbnail(youtubeRes.data.items[0].snippet.thumbnails),
                            dateRecorded: youtubeRes.data.items[0].snippet.publishedAt,
                            duration: youtubeRes.data.items[0].contentDetails.duration,
                            slug: youtubeRes.data.items[0].snippet.title.slice(0, 10).trim().replaceAll(/([\s\-_])+/g, "_").concat("-", youtubeRes.data.items[0].id),
                            service: "Youtube",
                        };
                    } else {
                        return setError(newVodForm, "video", "Youtube items.length wasn't exactly one(1)");
                    }
                } else {
                    return setError(newVodForm, "video", "Didnt get 200 from YouTube when getting video data");
                }
                break;
            }
            case "Kick": throw new Error("Not implemented");
            case "Rumble": throw new Error("Not implemented");
            default: throw new Error("Unable to determine video service");
        }

        //can check if videoId from intermediate data is duplicate here !

        try {
            await trpc(event).contributor.createCommunityVod.mutate(intermediateVodData);

            return message(newVodForm, "Vod created!");
        } catch (e) {
            if (e instanceof TRPCClientError) {
                return setError(newVodForm, "", `Service communication error: ${e.message}`);
            } else {
                return setError(newVodForm, "", "Server Error!");
            }
        }
    }
} satisfies Actions;