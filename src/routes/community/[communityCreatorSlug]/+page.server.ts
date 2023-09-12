import { trpc } from "$trpc/client";
import type { PageServerLoad, PageServerLoadEvent } from "./$types";

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
    const slug = event.url.pathname.split("/")[event.url.pathname.split("/").length - 1];
    const communityCreatorAndVods = await trpc(event).community.getCommunityCreatorBySlugWithVods.query(slug);
    
    return {
        communityCreatorAndVods
    }
}