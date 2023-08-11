import { error, json } from "@sveltejs/kit";
import { SECRET_TWITCH_CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_TWITCH_AUTH_CALLBACK_URI, PUBLIC_TWITCH_CLIENT_ID } from "$env/static/public";
import axios from "axios";

type TwitchTokenRes = {
    access_token: string,
    expires_in: number,
    refresh_token: string,
    scope: string[],
    token_type: "bearer"
}

export const POST = async ({ url }) => {
    const code = url.searchParams.get("code");

    if (!code) {
        throw error(400, new Error("No code param"));
    }

    const params = new URLSearchParams();
    params.append("code", code);
    params.append("client_id", PUBLIC_TWITCH_CLIENT_ID);
    params.append("client_secret", SECRET_TWITCH_CLIENT_SECRET);
    params.append("redirect_uri", PUBLIC_TWITCH_AUTH_CALLBACK_URI);
    params.append("grant_type", "authorization_code");

    const res = await axios.post<TwitchTokenRes>("https://id.twitch.tv/oauth2/token", params, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    if (res.status === 200) {
        return json(res.data);
    } else {
        console.log("Didnt get 200 from twitch when getting new token");
        throw error(400, new Error("Didnt get 200 from twitch when getting new token")); 
    }
}