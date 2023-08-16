import { z } from "zod";
import { SECRET_TWITCH_CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_TWITCH_AUTH_CALLBACK_URI_NEW, PUBLIC_TWITCH_CLIENT_ID } from "$env/static/public";
import axios from "$lib/server/AxiosClient";
import { router, publicProcedure } from "../t";
import { TRPCError } from "@trpc/server";

export const twitch = router({
    token: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
            const params = new URLSearchParams();
            params.append("code", input);
            params.append("client_id", PUBLIC_TWITCH_CLIENT_ID);
            params.append("client_secret", SECRET_TWITCH_CLIENT_SECRET);
            params.append("redirect_uri", PUBLIC_TWITCH_AUTH_CALLBACK_URI_NEW);
            params.append("grant_type", "authorization_code");

            const res = await axios.post<TwitchTokenRes>("https://id.twitch.tv/oauth2/token", params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            });
            if (res.status === 200) {
                return res.data;
            } else {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Didnt get 200 from twitch when getting new token with auth_code",
                    cause: "Axios/Server"
                });
            }
        }),
    refresh: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
            const encodedRefreshToken = encodeURIComponent(input);
            const params = new URLSearchParams();
            params.append("client_id", PUBLIC_TWITCH_CLIENT_ID);
            params.append("client_secret", SECRET_TWITCH_CLIENT_SECRET);
            params.append("refresh_token", encodedRefreshToken);
            params.append("grant_type", "refresh_token");

            const res = await axios.post<OAuthTokenPayload>("https://id.twitch.tv/oauth2/token", params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            if (res.status === 200) {
                return res.data;
            } else {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Didnt get 200 when refreshing Twitch token!",
                    cause: "Axios/Server"
                });
            }
        }),
    revoke: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
            const params = new URLSearchParams();
            params.append("client_id", PUBLIC_TWITCH_CLIENT_ID);
            params.append("token", input);
        
            const res = await axios.post("https://id.twitch.tv/oauth2/revoke", params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        
            if (res.status !== 200) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Didnt get OK when trying to revoke Twitch token",
                    cause: "Axios/Server"
                });
            }
        })
});