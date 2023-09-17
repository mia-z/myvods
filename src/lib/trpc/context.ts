import type { RequestEvent } from "@sveltejs/kit";
import type { inferAsyncReturnType } from "@trpc/server";

export const createContext = async (event: RequestEvent) => {

    return {
        userCookie: event.cookies.get("_u"),
        contributorCookie: event.cookies.get("_c")
    }
}

export type Context = inferAsyncReturnType<typeof createContext>;