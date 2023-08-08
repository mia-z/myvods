import { error, json } from "@sveltejs/kit";
import axios from "axios";
import { SECRET_TWITCH_CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_TWITCH_CLIENT_ID } from "$env/static/public";

export const POST = async ({ url }) => {
    const refreshToken = url.searchParams.get("refresh_token");

    if (!refreshToken) {
        throw error(400, new Error("Must provide a token parameter"))
    }
    const encodedRefreshToken = encodeURIComponent(refreshToken);
    const params = new URLSearchParams();
    params.append("client_id", PUBLIC_TWITCH_CLIENT_ID);
    params.append("client_secret", SECRET_TWITCH_CLIENT_SECRET);
    params.append("refresh_token", encodedRefreshToken);
    params.append("grant_type", "refresh_token");

    const res = await axios.post("https://id.twitch.tv/oauth2/token", params, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    return json({
        ...res.data
    });
}