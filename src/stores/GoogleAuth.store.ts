import axios from "axios";
import { writable } from "svelte/store";
import * as Cookies from "es-cookie";

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
        init: async () => {
            const refresh = Cookies.get("google_refresh");
            if (refresh) {
                const refreshRes = await axios.post<GoogleTokenRes>(`/api/google/auth/refresh?refresh_token=${refresh}`);
                console.log("GOOGLE TOKEN REFRESH");
                console.log(refreshRes.data);
                return set({
                    token: refreshRes.data.access_token,
                    expire: refreshRes.data.expires_in,
                    refresh: refreshRes.data.refresh_token
                });
            } else {
                const tokenRes = await axios.get<GoogleTokenRes>("/api/google/auth/token");
                console.log("NEW GOOGLE TOKEN");
                console.log(tokenRes.data);
                Cookies.set("google_refresh", tokenRes.data.refresh_token);
                return set({
                    token: tokenRes.data.access_token,
                    expire: tokenRes.data.expires_in,
                    refresh: tokenRes.data.refresh_token
                });
            }
        },
        setToken: (token: string) => update((s) => { return { ...s, token} }),
        setRefresh: (refresh: string) => update((s) => { return { ...s, refresh} }),
        setExpire: (expire: number) => update((s) => { return { ...s, expire} }),
		reset: () => set(initial)
	};
}

export const GoogleAuth = createAuthStore();