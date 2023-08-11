import axios from "axios";
import { derived, writable } from "svelte/store";

type TwitchTokenRes = {
    access_token: string,
    expires_in: number,
    token_type: "Bearer",
    scope: string,
    refresh_token: string
}

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
            const refreshRes = await axios.post<TwitchTokenRes>(`/api/twitch/auth/refresh?refresh_token=${refresh}`);
            console.log(refreshRes.data);
            return update((state) => { return {
                ...state,
                token: refreshRes.data.access_token,
                expire: refreshRes.data.expires_in,
                refresh: refreshRes.data.refresh_token,
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