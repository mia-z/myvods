import { derived, writable } from "svelte/store";
import { trpc } from "$trpc/client";
import * as Cookies from "es-cookie";
import { goto } from "$app/navigation";
import type { $Enums } from "@prisma/client";

const createStore = () => {
	const { subscribe, set, update } = writable<User>();

	return {
		subscribe,
        init: (user: User) => {
            set(user);
        },
        removeOAuth: (provider: $Enums.Provider) => {
            return update((s) => {
                return {
                    ...s,
                    oauthConnections: {
                        ...s.oauthConnections,
                        [provider]: null
                    }
                }
            });
        },
        invalidateUser: async () => {
            const userToken = Cookies.get("user");
            try {
                if (!userToken) {
                    throw Error("No user token exists!");
                }
                const userFromUuidToken = await trpc().user.getByUUIDToken.query(userToken);
                return update((state) => {
                    return {
                        ...state,
                        displayName: userFromUuidToken.displayName
                    }
                })
            } catch (e) {
                console.log(e);
                goto("/");
            }
        }
	};
}

export const UserData = createStore();
export const oAuthConnectionCount = derived(UserData, ($state) => {
    if ($state) {
        return Object.values($state.oauthConnections).reduce((acc, curr) => {
            if (curr) return acc + 1; else return acc;
        }, 0);
    } else return 0;
});