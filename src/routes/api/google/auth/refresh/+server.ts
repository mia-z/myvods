import { error, json } from "@sveltejs/kit";
import axios from "$lib/server/AxiosClient";
import { SECRET_GOOGLE_CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_GOOGLE_CLIENT_ID } from "$env/static/public";

export const POST = async ({ url }) => {
    const refreshToken = url.searchParams.get("refresh_token");

    if (!refreshToken) {
        throw error(400, new Error("Must provide a token parameter"))
    }

    const params = new URLSearchParams();
    params.append("client_id", PUBLIC_GOOGLE_CLIENT_ID);
    params.append("client_secret", SECRET_GOOGLE_CLIENT_SECRET);
    params.append("refresh_token", refreshToken);
    params.append("grant_type", "refresh_token");

    const res = await axios.post("https://oauth2.googleapis.com/token", params, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        validateStatus: () => true
    });

    if (res.status === 200) {
        return json(res.data);
    } else {
        throw error(res.status, "Didnt get 200 when refreshing Google token!");
    }
}