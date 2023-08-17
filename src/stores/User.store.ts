import { writable } from "svelte/store";
import { trpc } from "$trpc/client";
import type { Provider } from "../constants";

type User = {
    displayName: string,
    id: number ,
    oauthConnections: {
        [key in Provider]?: OAuthConnection
    }
}

type OAuthConnection = {
    id: number ,
    accountId: string,
    authCode: string,
    refreshToken: string
}

const createStore = () => {
	const { subscribe, set } = writable<User>();

	return {
		subscribe,
        init: async (uuidCookie: string) => {
            const userFromUuidToken = await trpc().user.getByUUIDToken.query(uuidCookie);
            const mappedConnections: User = {
                displayName: userFromUuidToken.displayName,
                id: userFromUuidToken.id,
                oauthConnections: {
                    Twitch: userFromUuidToken.oauthConnections.find(x => x.provider === "TWITCH"),
                    Google: userFromUuidToken.oauthConnections.find(x => x.provider === "GOOGLE")
                }
            }
            set(mappedConnections);
        }
	};
}

export const UserData = createStore();