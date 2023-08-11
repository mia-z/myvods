import { error, json } from "@sveltejs/kit";
import { SECRET_GOOGLE_CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_GOOGLE_AUTH_CALLBACK_URI, PUBLIC_GOOGLE_CLIENT_ID } from "$env/static/public";
import axios from "axios";

export const POST = async ({ url }) => {
    const code = url.searchParams.get("code");

    if (!code) {
        throw error(400, new Error("No code param"));
    }

    const params = new URLSearchParams();
    params.append("code", code);
    params.append("client_id", PUBLIC_GOOGLE_CLIENT_ID);
    params.append("client_secret", SECRET_GOOGLE_CLIENT_SECRET);
    params.append("redirect_uri", PUBLIC_GOOGLE_AUTH_CALLBACK_URI);
    params.append("grant_type", "authorization_code");

    const res = await axios.post<YoutubeTokenRes>("https://oauth2.googleapis.com/token", params, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    if (res.status === 200) {
        return json(res.data);
    } else {
        console.log("Didnt get 200 from google when getting new token");
        throw error(400, new Error("Didnt get 200 from google when getting new token")); 
    }
}