import { text } from "@sveltejs/kit";
import oauth from "$lib/server/GoogleAuth";

export const GET = async () => {
    const scope = [ "https://www.googleapis.com/auth/youtube.readonly" ];
    const access_type = "offline";

    const url = oauth.generateAuthUrl({
        access_type,
        scope
    });

    return text(url);
}