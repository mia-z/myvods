import { createContext } from "$lib/trpc/context";
import { router } from "$lib/trpc/router";
import type { Handle } from "@sveltejs/kit";
import { createTRPCHandle } from "trpc-sveltekit";
import l from "$lib/server/Logger";

export const handle: Handle = createTRPCHandle({ 
    router, 
    createContext, 
    onError: ({ error, path, type }) => {
        l.error({ source: "tRPC", text: `${error} @ ${type} ${path}` });
    } 
});