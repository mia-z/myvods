import type { RequestEvent } from "@sveltejs/kit";
import type { inferAsyncReturnType } from "@trpc/server";

export const createContext = async (event: RequestEvent) => {
    return {
        userCookie: event.cookies.get("_u"),
        contributorCookie: event.cookies.get("_c"),
        permissions: [],
        userPower: -1
    }
}

export type Context = inferAsyncReturnType<typeof createContext>;