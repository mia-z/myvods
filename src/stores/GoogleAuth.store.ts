import axios from "axios";
import { writable, derived } from "svelte/store";
import { trpc } from "$trpc/client";
type GoogleTokenRes = {
    access_token: string,
    expires_in: number,
    token_type: "Bearer",
    scope: string,
    refresh_token: string
}

const initial = {
    token: "", 
    refresh: "", 
    expire: 0
}

const createAuthStore = () => {
	const { subscribe, set, update } = writable(initial);

	return {
		subscribe,
        init: async (refreshToken: string) => {
            const refreshRes = await trpc().google.refresh.query(refreshToken);
            console.log(refreshRes);
            return set({
                token: refreshRes.access_token,
                expire: refreshRes.expires_in,
                refresh: refreshRes.refresh_token as string
            });
        },
        setToken: (token: string) => update((s) => { return { ...s, token} }),
        setRefresh: (refresh: string) => update((s) => { return { ...s, refresh} }),
        setExpire: (expire: number) => update((s) => { return { ...s, expire} }),
		reset: () => set(initial)
	};
}

export const GoogleAuth = createAuthStore();
export const GoogleRestClient = derived(GoogleAuth, ($state) => {
    return axios.create({
        headers: {
            "Authorization": `Bearer ${$state.token}`
        },
        baseURL: "https://www.googleapis.com/youtube/v3"
    });
});