import type { RequestEvent } from "@sveltejs/kit";
import type { inferAsyncReturnType } from "@trpc/server";

type CreateContextOptions = {
    userCookie: string | undefined
}

export const createContextInner = async (opts: CreateContextOptions) => {
    return {
        userCookie: opts.userCookie
    };
}

export const createContext = async (event: RequestEvent) => {
    const userCookie = event.cookies.get("user");
    
    return createContextInner({
        userCookie
    });
}

export type Context = inferAsyncReturnType<typeof createContext>;