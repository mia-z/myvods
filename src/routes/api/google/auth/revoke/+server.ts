import { error, text } from "@sveltejs/kit";
import axios from "$lib/server/AxiosClient";

export const POST = async ({ url }) => {
    const token = url.searchParams.get("token");

    if (!token || token === "") {
        throw error(400, new Error("Must provide a token parameter"))
    }

    const params = new URLSearchParams();
    params.append("token", token);

    const res = await axios.post("https://oauth2.googleapis.com/revoke", params, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    if (res.status !== 200) {
        throw error(res.status, "Didnt get 200 from Google when revoking token!");
    }

    return text("ok");
}