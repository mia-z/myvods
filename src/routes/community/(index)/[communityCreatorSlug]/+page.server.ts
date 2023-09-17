import { trpc } from "$trpc/client";
import { error } from "@sveltejs/kit";
import type { PageServerLoad, PageServerLoadEvent } from "./$types";

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
    const communityCreatorAndVods = await trpc(event).community.getCommunityCreatorBySlugWithVods.query(event.params.communityCreatorSlug);
    
    if (communityCreatorAndVods) {
        return {
            communityCreatorAndVods
        }
    } else {
        throw error(404, "Community Creator Not found");
    }
}