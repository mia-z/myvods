import { trpc } from "$trpc/client";
import axios from "axios";
import { derived, writable } from "svelte/store";

type TwitchAuthState = {
    token: string,
    refresh: string,
    expire: number
}

const initial: TwitchAuthState = {
    token: "", 
    refresh: "", 
    expire: 0,
}

const createAuthStore = () => {
	const { subscribe, set, update } = writable<TwitchAuthState>(initial);

	return {
		subscribe,
        init: async (refresh: string) => {
            const refreshRes = await trpc().twitch.refresh.query(refresh);
            console.log(refreshRes);
            return update((state) => { return {
                ...state,
                token: refreshRes.access_token,
                expire: refreshRes.expires_in,
                refresh: refreshRes.refresh_token as string,
            }});
        },
        setToken: (token: string) => update((s) => { return { ...s, token} }),
        setRefresh: (refresh: string) => update((s) => { return { ...s, refresh} }),
        setExpire: (expire: number) => update((s) => { return { ...s, expire} }),
		reset: () => set(initial)
	};
}

export const TwitchAuth = createAuthStore();
export const TwitchRestClient = derived(TwitchAuth, ($state) => {
    return axios.create({
        headers: {
            "Authorization": `Bearer ${$state.token}`
        },
        baseURL: "https://api.twitch.tv/helix"
    });
});