import * as Cookies from "es-cookie";
import axios from "axios";
import { PUBLIC_GOOGLE_API_KEY } from "$env/static/public";

import type { Prisma } from "@prisma/client";
import { goto } from "$app/navigation";

type User = Prisma.UserGetPayload<{
    include: {
        oauthConnections: true,
        tokens: true
    }
}>;

const setupGoogleAuth = async (code: string) => {
    const tokenRes = await axios.post<YoutubeTokenRes>(`/api/google/auth/token?code=${code}`);

    const googleUserRes = await axios.get<Google.Person>(`https://people.googleapis.com/v1/people/me?personFields=names&key=${PUBLIC_GOOGLE_API_KEY}`, {
        headers: {
            "Authorization": `Bearer ${tokenRes.data.access_token}`,
            "Accept": "application/json"
        }
    });
    console.log(tokenRes.data.access_token);
    const googleUser = googleUserRes.data.names.find(x => x.metadata.source.type === "PROFILE");

    if (!googleUser) {
        console.log("Couldnt get user from fetched People API data checking for PROFILE");
        return;
    }

    const internalUserRes = await axios.get<User>("/api/user/hasprovider/google/" + googleUser.metadata.source.id, {
        validateStatus: () => true
    });

    if (internalUserRes.status !== 200) {
        const createUserRes = await axios.post<User>("/api/user", JSON.stringify({
            displayName: googleUser.displayName,
            accountId: googleUser.metadata.source.id,
            provider: "GOOGLE",
            authCode: code,
            refreshToken: tokenRes.data.refresh_token
        }), {
            validateStatus: () => true
        });
        Cookies.set("user", createUserRes.data.tokens[0].token);
        return goto("/app");
    } else {
        const user = internalUserRes.data;
        const newTokenRes = await axios.get<string>(`/api/user/${user.id}/newtoken`, {
            validateStatus: () => true
        });
        Cookies.set("user", newTokenRes.data);
        return goto("/app");
    }
}

export {
    setupGoogleAuth,
}