import * as Cookies from "es-cookie";
import axios from "axios";
import type { Prisma } from "@prisma/client";
import { goto } from "$app/navigation";
import { z } from "zod";
import { PUBLIC_TWITCH_CLIENT_ID } from "$env/static/public";

type User = Prisma.UserGetPayload<{
    include: {
        oauthConnections: true,
        tokens: true
    }
}>;

type CreateNewUserRequest = {
    displayName: string,
    accountId: string,
    provider: "TWITCH",
    authCode: string,
    refreshToken: string
}

const TwitchTokenResponseSchema = z.object({
    access_token: z.string().nonempty(),
    expires_in: z.number().nonnegative(),
    token_type: z.literal("bearer"),
    scope: z.array(z.string()).optional(),
    refresh_token: z.string().nonempty(),
});

const TwitchUserResponseSchema = z.object({
    user_id: z.string().nonempty(),
    expires_in: z.number().nonnegative(),
    scopes: z.array(z.string()).optional().nullable(),
    client_id: z.literal(PUBLIC_TWITCH_CLIENT_ID),
    login: z.string().nonempty(),
});

const setupTwitchAuth = async (code: string) => {
    const tokenRes = await getTokenFromCode(code);

    const validatedTokenObject = validateTokenResponse(tokenRes);

    const twitchUserFromTokenRes = await getTwitchUserFromToken(validatedTokenObject.access_token);

    const validatedTwitchUserObject = validatedTwitchUserData(twitchUserFromTokenRes);

    const internalUserData = await checkUserExists(validatedTwitchUserObject);

    if (internalUserData) {
        await generateUserToken(internalUserData.id);
    } else {
        await createNewUser({
            displayName: validatedTwitchUserObject.login,
            accountId: validatedTwitchUserObject.user_id,
            provider: "TWITCH",
            authCode: code,
            refreshToken: validatedTokenObject.refresh_token
        });
    }
}

const getTokenFromCode = async (code: string): Promise<TwitchTokenRes> => {
    const res = await axios.post<TwitchTokenRes>(`/api/twitch/auth/token?code=${code}`);
    if (res.status !== 200) {
        throw new Error("Didnt get 200 when fetching token from auth_code");
    } else {
        return res.data;
    }
}

const validateTokenResponse = (tokenResponseObject: TwitchTokenRes): TwitchTokenRes => {
    const validated = TwitchTokenResponseSchema.safeParse(tokenResponseObject);
    if (validated.success) {
        return validated.data;
    } else {
        throw new Error("Failed to validate tokenResponseObject from Twitch");
    }
}

const getTwitchUserFromToken = async (token: string): Promise<TwitchTokenUser> => {
    const res = await axios.get<TwitchTokenUser>("https://id.twitch.tv/oauth2/validate", {
        headers: {
            "Authorization": `OAuth ${token}`
        },
        validateStatus: () => true
    });

    if (res.status === 200) {
        return res.data;
    } else {
        throw new Error("Couldnt get Twitch user data with the new token from twitch!" + res.data.toString());
    }
}

const validatedTwitchUserData = (twitchUser: TwitchTokenUser): TwitchTokenUser => {
    const validated = TwitchUserResponseSchema.safeParse(twitchUser);
    if (validated.success) {
        return validated.data;
    } else {
        console.log(twitchUser);
        console.log(validated.error.errors)
        throw new Error("Failed to validate twitchUserData from Twitch via new token");
    }
}

const checkUserExists = async (tokenUser: TwitchTokenUser): Promise<User | null> => {
    const internalUserRes = await axios.get<User>(`/api/user/hasprovider/twitch/${tokenUser.user_id}`, {
        validateStatus: () => true
    });

    if (internalUserRes.status === 200) {
        return internalUserRes.data;
    } else {
        return null;
    }
}

const createNewUser = async (newUser: CreateNewUserRequest) => {
    const createUserRes = await axios.post<User>("/api/user", JSON.stringify(newUser), {
        validateStatus: () => true
    });
    Cookies.set("user", createUserRes.data.tokens[0].token);
    return goto("/app");
}

const generateUserToken = async (userId: number) => {
    const newTokenRes = await axios.get<string>(`/api/user/${userId}/newtoken`, {
        validateStatus: () => true
    });
    Cookies.set("user", newTokenRes.data);
    return goto("/app");
}

export {
    setupTwitchAuth
}