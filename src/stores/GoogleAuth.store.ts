import axios from "axios";
import { writable, derived } from "svelte/store";

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
            const refreshRes = await axios.post<GoogleTokenRes>(`/api/google/auth/refresh?refresh_token=${refreshToken}`);
            console.log(refreshRes.data);
            return set({
                token: refreshRes.data.access_token,
                expire: refreshRes.data.expires_in,
                refresh: refreshRes.data.refresh_token
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