import { trpc } from "$trpc/client";
import { error, type Actions, fail } from "@sveltejs/kit";
import type { PageServerLoad, PageServerLoadEvent } from "./$types";
import { z } from "zod";
import { message, setError, superValidate } from "sveltekit-superforms/client";
import prisma from "$lib/server/Prisma";
import { TRPCClientError } from "@trpc/client";

const newVodFormSchema = z.object({
    videoId: z.string().nonempty("Must enter a video ID or valid URL"),
    service: z.union([
        z.literal("Twitch"),
        z.literal("Youtube"),
        z.literal("Kick")
    ]).default("Youtube"),
    communityCreatorId: z.number()
});

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
    const communityCreatorAndVods = await trpc(event).community.getCommunityCreatorBySlugWithVods.query(event.params.communityCreatorSlug);
    
    if (communityCreatorAndVods) {
        if (event.locals.communityContributorNick) {
            const newVodForm = await superValidate(newVodFormSchema);
            return {
                communityCreatorAndVods,
                newVodForm
            }
        } else {
            return {
                communityCreatorAndVods
            }
        }
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

        if (newVodForm.data.videoId.match(/^(http(s)?:\/\/|www\.)/)) {
            const urlToExtract = new URL(newVodForm.data.videoId);
            const videoIdFromParameter = urlToExtract.searchParams.get("v");
            if (!videoIdFromParameter) {
                return setError(newVodForm, "videoId", "Couldnt parse Video ID parameter from URL");
            } else {
                newVodForm.data.videoId = videoIdFromParameter
            }
        }

        const isDuplicate = await prisma.communityVod.count({
            where: {
                videoId: newVodForm.data.videoId
            }
        });

        if (isDuplicate > 0) {
            return setError(newVodForm, "videoId", "Video ID already exists");
        }

        try {
            await trpc(event).contributor.createCommunityVod.mutate({
                communityCreatorId: newVodForm.data.communityCreatorId,
                service: newVodForm.data.service,
                videoId: newVodForm.data.videoId
            });

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