import { error, json } from "@sveltejs/kit";
import axios from "axios";
import { SECRET_YOUTUBE_CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_YOUTUBE_CLIENT_ID } from "$env/static/public";

export const POST = async ({ url }) => {
    const refreshToken = url.searchParams.get("refresh_token");

    if (!refreshToken) {
        throw error(400, new Error("Must provide a token parameter"))
    }

    const params = new URLSearchParams();
    params.append("client_id", PUBLIC_YOUTUBE_CLIENT_ID);
    params.append("client_secret", SECRET_YOUTUBE_CLIENT_SECRET);
    params.append("refresh_token", refreshToken);
    params.append("grant_type", "refresh_token");

    const res = await axios.post("https://oauth2.googleapis.com/token", params, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    return json({
        ...res.data
    });
}