import oauth from "$lib/server/GoogleAuth";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
    const code = url.searchParams.get("code");
    if (code) {
        const token = await oauth.getToken(code);
        return {
            token
        }
    }
};