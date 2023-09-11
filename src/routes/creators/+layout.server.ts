import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { trpc } from "$trpc/client";

export const load: LayoutServerLoad = async (event) => {
    const userCookie = event.cookies.get("user");
    if (userCookie) {
        const userFromUuidToken = await trpc(event).user.getByUUIDToken.query(userCookie);
        const mappedConnections: User = {
            displayName: userFromUuidToken.displayName,
            id: userFromUuidToken.id,
            oauthConnections: {
                TWITCH: userFromUuidToken.oauthConnections.find(x => x.provider === "TWITCH"),
                GOOGLE: userFromUuidToken.oauthConnections.find(x => x.provider === "GOOGLE")
            },
            vods: userFromUuidToken.vods
        }
        return mappedConnections;
    } else {
        throw redirect(302, "/");
    }
}