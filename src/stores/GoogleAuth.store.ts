import axios from "axios";
import { writable, derived } from "svelte/store";
import { PUBLIC_GOOGLE_API_KEY } from "$env/static/public";
import { trpc } from "$trpc/client";

type GoogleAuthState = {
    token: string,
    refresh: string,
    expire: number,
    user: Google.Person | null
}

const initial: GoogleAuthState = {
    token: "", 
    refresh: "", 
    expire: 0,
    user: null
}

const createAuthStore = () => {
	const { subscribe, set, update } = writable(initial);

	return {
		subscribe,
        init: async (refreshToken: string) => {
            const refreshRes = await trpc().google.refresh.query(refreshToken);
            const res = await axios.get<Google.Person>(`https://people.googleapis.com/v1/people/me?personFields=names&key=${PUBLIC_GOOGLE_API_KEY}`, {
                headers: {
                    "Authorization": `Bearer ${refreshRes.access_token}`,
                    "Accept": "application/json"
                }
            });
            return update((state) => { return {
                ...state,
                token: refreshRes.access_token,
                expire: refreshRes.expires_in,
                refresh: refreshRes.refresh_token as string,
                user: res.data
            }});
        },
        setToken: (token: string) => update((s) => { return { ...s, token} }),
        setRefresh: (refresh: string) => update((s) => { return { ...s, refresh} }),
        setExpire: (expire: number) => update((s) => { return { ...s, expire} }),
        setUser: (user:  Google.Person) => update((s) => { return { ...s, user} }),
        revoke: async (token: string) => {
            const revokeRes = await axios.post(`https://oauth2.googleapis.com/revoke?token=${token}`, {
                validateStatus: () => true
            });
            console.log("revoked google with res: " + revokeRes.status);
            return update((state) => { return {
                ...state,
                user: null
            }});
        },
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