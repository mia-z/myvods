import { t } from "./t";
import { twitch } from "$trpcroutes/twitch";
import { google } from "$trpcroutes/google";
import { user } from "$trpcroutes/user";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const router = t.router({
    twitch,
    google,
    user
});

export type Router = typeof router;

export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;