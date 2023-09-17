import { z } from "zod";
import axios from "$lib/server/AxiosClient";
import { SECRET_GOOGLE_CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_GOOGLE_CLIENT_ID, PUBLIC_GOOGLE_AUTH_CALLBACK_URI_NEW, PUBLIC_GOOGLE_AUTH_CALLBACK_URI_LINK } from "$env/static/public";
import { router, publicProcedure } from "../t";
import { TRPCError } from "@trpc/server";

export const google = router({
    token: publicProcedure
        .input(z.object({
            code: z.string(),
            mode: z.string()
        }))
        .query(async ({ input }) => {
            const params = new URLSearchParams();
            params.append("code", input.code);
            params.append("client_id", PUBLIC_GOOGLE_CLIENT_ID);
            params.append("client_secret", SECRET_GOOGLE_CLIENT_SECRET);
            params.append("redirect_uri", input.mode === "link" ? PUBLIC_GOOGLE_AUTH_CALLBACK_URI_LINK : PUBLIC_GOOGLE_AUTH_CALLBACK_URI_NEW);
            params.append("grant_type", "authorization_code");

            const res = await axios.post<OAuthTokenPayload>("https://oauth2.googleapis.com/token", params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            if (res.status === 200) {
                return res.data;
            } else {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Didnt get 200 from Google when getting new token with auth_code",
                    cause: "Server/Axios"
                });
            }
        }),
    refresh: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
            const params = new URLSearchParams();
            params.append("client_id", PUBLIC_GOOGLE_CLIENT_ID);
            params.append("client_secret", SECRET_GOOGLE_CLIENT_SECRET);
            params.append("refresh_token", input);
            params.append("grant_type", "refresh_token");

            const res = await axios.post<OAuthTokenPayload>("https://oauth2.googleapis.com/token", params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            if (res.status === 200) {
                return res.data;
                
            } else {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Didnt get 200 when refreshing Google token!",
                    cause: "Server/Axios"
                });
            }
        }),
    revoke: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
            const params = new URLSearchParams();
            params.append("token", input);

            const res = await axios.post("https://oauth2.googleapis.com/revoke", params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        
            if (res.status !== 200) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Didnt get OK when trying to revoke Google token",
                    cause: "Server/Axios"
                });
            }
        })
});