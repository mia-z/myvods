import * as Cookies from "es-cookie";
import axios from "axios";
import type { Prisma } from "@prisma/client";
import { goto } from "$app/navigation";

type User = Prisma.UserGetPayload<{
    include: {
        oauthConnections: true,
        tokens: true
    }
}>;

const setupTwitchAuth = async (code: string) => {
    const tokenRes = await axios.post<TwitchTokenRes>(`/api/twitch/auth/token?code=${code}`);

    const validRes = await validateTwitchToken(tokenRes.data.access_token);

    const internalUserRes = await axios.get<User>(`/api/user/hasprovider/twitch/${validRes.userId}`, {
        validateStatus: () => true
    });

    if (internalUserRes.status !== 200) {
        const createUserRes = await axios.post<User>("/api/user", JSON.stringify({
            displayName: validRes.login,
            accountId: validRes.userId,
            provider: "TWITCH",
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

const validateTwitchToken = async (token: string): Promise<TwitchUser> => {
    const res = await axios.get<TwitchValidateRes>("https://id.twitch.tv/oauth2/validate", {
        headers: {
            "Authorization": `OAuth ${token}`
        },
        validateStatus: () => true
    });

    if (res.status === 200) {
        return {
            login: res.data.login,
            userId: res.data.user_id
        }
    } else {
        throw new Error("Couldnt validate the new token from twitch!" + res.data.toString());
    }
}

export {
    setupTwitchAuth
}