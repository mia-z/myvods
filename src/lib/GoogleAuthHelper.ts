import * as Cookies from "es-cookie";
import axios from "axios";
import { PUBLIC_GOOGLE_API_KEY } from "$env/static/public";
import { goto } from "$app/navigation";
import { z } from "zod";
import { trpc } from "./trpc/client";

type CreateNewUserRequest = {
    displayName: string,
    accountId: string,
    provider: "GOOGLE" | "TWITCH",
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

const OAuthPayloadSchema = z.object({
    access_token: z.string().nonempty(),
    expires_in: z.number().nonnegative(),
    token_type: z.union([ z.literal("Bearer"), z.literal("bearer") ]),
    scope: z.union([ z.string(), z.array(z.string()) ]).nullable(),
    refresh_token: z.string().nonempty().optional(),
});

const GoogleUserResponseSchema = z.object({
    metadata: z.object({
        source: z.object({
            type: z.union([
                z.literal("PROFILE"), z.literal("CONTACT")
            ]),
            id: z.string()
        })
    }),
    displayName: z.string()
});

const setupGoogleAuth = async (code: string, mode: string) => {
    const tokenRes = await getTokenFromCode(code, mode);

    const validatedToken = validateOAuthTokenPayload(tokenRes);

    const googleUserRes = await getGoogleUserData(validatedToken.access_token);

    const validatedUser = validateGoogleUserObject(googleUserRes);

    const internalUserData = await checkUserExists(validatedUser.metadata.source.id)

    if (mode === "link") {
        const token = Cookies.get("user");
        if (!token) {
            throw Error("Tried linking an account, but token doesnt exist!");
        }

        const userFromToken = await trpc().user.getByUUIDToken.query(token);

        await linkNewOAuth({
            userId: userFromToken.id,
            accountId: validatedUser.metadata.source.id,
            provider: "GOOGLE",
            authCode: code,
            refreshToken: tokenRes.refresh_token as string
        });
    } else if (internalUserData) {
        await generateUserToken(internalUserData.user.id);
    } else {
        await createNewUser({
            displayName: validatedUser.displayName,
            accountId: validatedUser.metadata.source.id,
            provider: "GOOGLE",
            authCode: code,
            refreshToken: tokenRes.refresh_token as string
        });
    }

    return goto(mode === "link" ? "/creators/profile" : "/creators");
}

const getTokenFromCode = async (code: string, mode: string): Promise<OAuthTokenPayload> => {
    return await trpc().google.token.query({ code, mode });
}

const validateOAuthTokenPayload= (oauthPayload: OAuthTokenPayload): OAuthTokenPayload => {
    const validated = OAuthPayloadSchema.safeParse(oauthPayload);
    console.log(oauthPayload)
    if (validated.success) {
        return validated.data;
    } else {
        console.log(validated.error.errors)
        throw new Error("Failed to validate tokenResponseObject from Google");
    }
}

const getGoogleUserData = async (accessToken: string): Promise<Google.Person> => {
    const res = await axios.get<Google.Person>(`https://people.googleapis.com/v1/people/me?personFields=names&key=${PUBLIC_GOOGLE_API_KEY}`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Accept": "application/json"
        }
    });
    if (res.status === 200) {
        Cookies.set("gid", res.data.names[0].metadata.source.id);
        return res.data;
    } else {
        throw new Error("Couldnt get Google user data with the new token from Google!" + res.data.toString());    
    }
}

const validateGoogleUserObject = (googlePersonObject: Google.Person): Pick<Google.PersonName, "displayName" | "metadata"> => {
    const googleUser = googlePersonObject.names.find(x => x.metadata.source.type === "PROFILE" || x.metadata.source.type === "CONTACT");

    if (!googleUser) {
        throw new Error("Returned Google.Person didnt contain a name with PROFILE or CONTACT flag")
    }

    const validatedUserObject = GoogleUserResponseSchema.safeParse(googleUser);

    if (validatedUserObject.success) {
        return validatedUserObject.data;
    } else {
        console.log(googlePersonObject);
        console.log(validatedUserObject.error.errors);
        throw new Error("Failed to validate Google.Person object");
    }
}

const checkUserExists = async (accountId: string) => {
    return await trpc().user.getByOAuthProviderId.query({ accountId, provider: "GOOGLE" })
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
    setupGoogleAuth,
}