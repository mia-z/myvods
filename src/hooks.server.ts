import { createContext } from "$lib/trpc/context";
import { router } from "$lib/trpc/router";
import type { Handle } from "@sveltejs/kit";
import { createTRPCHandle } from "trpc-sveltekit";
import l from "$lib/server/Logger";
import { sequence } from "@sveltejs/kit/hooks";
import { SECRET_JWT_SECRET } from "$env/static/private";
import JWT from "jsonwebtoken";
import prisma from "$lib/server/Prisma";

export const trpcHandle: Handle = createTRPCHandle({ 
    router, 
    createContext, 
    onError: ({ error, path, type }) => {
        l.error({ source: "tRPC", text: `${error} @ ${type} ${path}` });
    } 
});

export const communityAuthHandle: Handle = async ({ event, resolve }) => {
    if (event.url.pathname.startsWith("/community")) {
        const cookie = event.cookies.get("_c");
        if (cookie) {
            try {
                const token = JWT.verify(cookie, SECRET_JWT_SECRET);
                const verifiedUser = await prisma.communityContributor
                    .findFirst({
                        where: {
                            tokens: {
                                some: {
                                    token: token as string //TS cant coerce this one, but _I_ know its a string
                                }
                            }
                        }
                    });
                if (verifiedUser) {
                    event.locals.communityContributorId = verifiedUser.id;
                    event.locals.communityContributorNick = verifiedUser.nick;
                }
                return resolve(event);
            } catch (e) {
                if (e instanceof JWT.JsonWebTokenError) {
                    l.error({ source: "Server/hook/JWT", text: `JWT Error - ${e.message}` });
                    event.cookies.delete("_c");
                } else {
                    l.error({ source: "Server/hook", text: `Hook Error - ${e}` });
                }
                return resolve(event);
            }
        }
        return resolve(event);
    }
    return resolve(event);
}

export const handle = sequence(trpcHandle, communityAuthHandle);