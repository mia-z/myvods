import { trpc } from "$trpc/client";
import type { PageServerLoad, PageServerLoadEvent } from "./$types";

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
    const communityCreators = await trpc(event).community.getCommunityCreators.query();
    
    return {
        communityCreators
    }
}