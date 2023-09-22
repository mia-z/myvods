import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
    return {
        communityContributorNick: locals.communityContributorNick,
        communityContributorId: locals.communityContributorId,
    }
};