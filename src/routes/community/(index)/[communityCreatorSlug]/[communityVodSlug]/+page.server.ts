import { trpc } from "$trpc/client";
import { error, type Actions } from "@sveltejs/kit";
import type { PageServerLoad, PageServerLoadEvent } from "./$types";

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
    const communityVodWithAnnotations = await trpc(event).community.getCommunityVodBySlugWithAnnotations.query(event.params.communityVodSlug);
    
    if (communityVodWithAnnotations) {
        console.log(communityVodWithAnnotations)
        return {
            communityVodWithAnnotations
        }
    } else {
        throw error(404, "Community Creator Vod Not found")
    }
}

export const actions = {
    newAnnotation: async ({ request }) => {
        const data = Object.fromEntries(await request.formData());
        console.log(data);
        return { success: true };
    },
    register: async (event) => {
        // TODO register the user
    },
} satisfies Actions;