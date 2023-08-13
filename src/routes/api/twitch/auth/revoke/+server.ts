import { error, text } from "@sveltejs/kit";
import axios from "axios";
import { PUBLIC_TWITCH_CLIENT_ID } from "$env/static/public";

export const POST = async ({ url }) => {
    const token = url.searchParams.get("token");

    if (!token || token === "") {
        throw error(400, new Error("Must provide a token parameter"))
    }

    const params = new URLSearchParams();
    params.append("client_id", PUBLIC_TWITCH_CLIENT_ID);
    params.append("token", token);

    const res = await axios.post("https://id.twitch.tv/oauth2/revoke", params, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    if (res.status !== 200) {
        throw error(res.status, "Didnt get OK when trying to revoke Twitch token");
    }

    return text("ok");
}