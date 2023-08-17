import { trpc } from "$trpc/client";
import axios from "axios";
import { derived, writable } from "svelte/store";
import { PUBLIC_TWITCH_CLIENT_ID } from "$env/static/public";
import * as Cookies from "es-cookie";

type TwitchAuthState = {
    token: string,
    refresh: string,
    expire: number,
    user: Twitch.User | null
}

const initial: TwitchAuthState = {
    token: "", 
    refresh: "", 
    expire: 0,
    user: null
}

const createAuthStore = () => {
	const { subscribe, set, update } = writable<TwitchAuthState>(initial);

	return {
		subscribe,
        init: async (refresh: string) => {
            const refreshRes = await trpc().twitch.refresh.query(refresh);
            console.log("twitch refresh res");
            console.log(refreshRes);
            const twitchId = Cookies.get("tid");
            if (!twitchId) {
                throw Error("There isnt a twitch id save in cookie, this shouldnt happen");
            }
            const res = await axios.get(`https://api.twitch.tv/helix/users?id=${twitchId}`, {
                headers: {
                    "Authorization": `Bearer ${refreshRes.access_token}`,
                    "Client-ID": PUBLIC_TWITCH_CLIENT_ID
                },
            });
            console.log("twitch user res");
            console.log(res.data);
            return update((state) => { return {
                ...state,
                token: refreshRes.access_token,
                expire: refreshRes.expires_in,
                refresh: refreshRes.refresh_token as string,
                user: res.data.data[0]
            }});
        },
        setToken: (token: string) => update((s) => { return { ...s, token} }),
        setRefresh: (refresh: string) => update((s) => { return { ...s, refresh} }),
        setExpire: (expire: number) => update((s) => { return { ...s, expire} }),
        setUser: (user:  Twitch.User) => update((s) => { return { ...s, user} }),
		reset: () => set(initial)
	};
}

export const TwitchAuth = createAuthStore();
export const TwitchRestClient = derived(TwitchAuth, ($state) => {
    return axios.create({
        headers: {
            "Authorization": `Bearer ${$state.token}`,
            "Client-ID": PUBLIC_TWITCH_CLIENT_ID
        },
        baseURL: "https://api.twitch.tv/helix"
    });
});