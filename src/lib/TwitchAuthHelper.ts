import * as Cookies from "es-cookie";
import axios from "axios";
import { goto } from "$app/navigation";
import { z } from "zod";
import { PUBLIC_TWITCH_CLIENT_ID } from "$env/static/public";
import { trpc } from "$trpc/client";

type CreateNewUserRequest = {
    displayName: string,
    accountId: string,
    provider: "TWITCH",
    authCode: string,
    refreshToken: string
}

type LinkOAuthRequest = {
    userId: number,
    accountId: string,
    provider: "GOOGLE" | "TWITCH",
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

const setupTwitchAuth = async (code: string, mode: string) => {
    const tokenRes = await getTokenFromCode(code, mode);

    const validatedTokenObject = validateTokenResponse(tokenRes);

    const twitchUserFromTokenRes = await getTwitchUserFromToken(validatedTokenObject.access_token);

    const validatedTwitchUserObject = validatedTwitchUserData(twitchUserFromTokenRes);

    const internalUserData = await checkUserExists(validatedTwitchUserObject);

    if (mode === "link") {
        const token = Cookies.get("user");
        if (!token) {
            throw Error("Tried linking an account, but token doesnt exist!");
        }

        const userFromToken = await trpc().user.getByUUIDToken.query(token);

        await linkNewOAuth({
            userId: userFromToken.id,
            accountId: validatedTwitchUserObject.user_id,
            provider: "TWITCH",
            authCode: code,
            refreshToken: tokenRes.refresh_token as string
        });
    } else if (internalUserData) {
        await generateUserToken(internalUserData.user.id);
    } else {
        await createNewUser({
            displayName: validatedTwitchUserObject.login,
            accountId: validatedTwitchUserObject.user_id,
            provider: "TWITCH",
            authCode: code,
            refreshToken: validatedTokenObject.refresh_token as string
        });
    }

    return goto(mode === "link" ? "/app/profile" : "/app");
}

const getTokenFromCode = async (code: string, mode: string): Promise<OAuthTokenPayload> => {
    return await trpc().twitch.token.query({ code, mode });
}

const validateTokenResponse = (tokenResponseObject: OAuthTokenPayload): OAuthTokenPayload => {
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
        Cookies.set("tid", res.data.user_id);
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
        throw new Error("Failed to validate twitchUserData from Twitch via new token");
    }
}

const checkUserExists = async (tokenUser: TwitchTokenUser) => {
    return await trpc().user.getByOAuthProviderId.query({ accountId: tokenUser.user_id, provider: "TWITCH" })
}

const createNewUser = async (newUser: CreateNewUserRequest) => {
    const createUserRes = await trpc().user.createNewUserWithOAuth.mutate(newUser);
    Cookies.set("user", createUserRes.tokens[0].token);
}

const generateUserToken = async (userId: number) => {
    const newToken = await trpc().user.generateUserToken.mutate(userId);
    Cookies.set("user", newToken);
}

const linkNewOAuth = async (newOAuth: LinkOAuthRequest) => {
    const linkNewOAuthRes = await trpc().user.linkNewOAuth.mutate(newOAuth);
    Cookies.set("user", linkNewOAuthRes)
}

export {
    setupTwitchAuth
}