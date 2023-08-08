import axios from "axios";
import { derived, writable } from "svelte/store";
import * as Cookies from "es-cookie";

type TwitchTokenRes = {
    access_token: string,
    expires_in: number,
    token_type: "Bearer",
    scope: string,
    refresh_token: string
}

type TwitchValidateRes = {
    client_id: string,
    login: string,
    scopes: string[],
    user_id: string,
    expires_in: number
}

type TwitchUser = {
    login: string,
    userId: string
}

type TwitchAuthState = {
    active: boolean,
    token: string,
    refresh: string,
    expire: number,
    userData: TwitchUser
}

const initial: TwitchAuthState = {
    active: false,
    token: "", 
    refresh: "", 
    expire: 0,
    userData: {
        login: "",
        userId: ""
    }
}

const createAuthStore = () => {
	const { subscribe, set, update } = writable<TwitchAuthState>(initial);

	return {
		subscribe,
        init: async () => {
            const refresh = Cookies.get("twitch_refresh");
            if (refresh) {
                const refreshRes = await axios.post<TwitchTokenRes>(`/api/twitch/auth/refresh?refresh_token=${refresh}`);
                console.log("TWITCH TOKEN REFRESH");
                console.log(refreshRes.data);
                console.log("Validating twitch token");
                const validRes = await validateTwitchToken(refreshRes.data.access_token);
                console.log("Validated twitch token");
                return update((state) => { return {
                    ...state,
                    token: refreshRes.data.access_token,
                    expire: refreshRes.data.expires_in,
                    refresh: refreshRes.data.refresh_token,
                    userData: validRes
                }});
            } else {
                const tokenRes = await axios.get<TwitchTokenRes>("/api/twitch/auth/token");
                console.log("NEW TWITCH TOKEN");
                console.log(tokenRes.data);
                Cookies.set("twitch_refresh", tokenRes.data.refresh_token);
                console.log("Validating twitch token");
                const validRes = await validateTwitchToken(tokenRes.data.access_token);
                console.log("Validated twitch token");
                return update((state) => { return {
                    ...state,
                    token: tokenRes.data.access_token,
                    expire: tokenRes.data.expires_in,
                    refresh: tokenRes.data.refresh_token,
                    userData: validRes
                }});
            }
        },
        setToken: (token: string) => update((s) => { return { ...s, token} }),
        setRefresh: (refresh: string) => update((s) => { return { ...s, refresh} }),
        setExpire: (expire: number) => update((s) => { return { ...s, expire} }),
		reset: () => set(initial)
	};
}

export const TwitchAuth = createAuthStore();
export const TwitchRestClient = derived(TwitchAuth, ($state) => {
    console.log("Token updated, updating axios client");
    return axios.create({
        headers: {
            "Authorization": `Bearer ${$state.token}`
        },
        baseURL: "https://api.twitch.tv/helix"
    });
});

const validateTwitchToken = async (token: string): Promise<TwitchUser> => {
    const res = await axios.get<TwitchValidateRes>("https://id.twitch.tv/oauth2/validate", {
        headers: {
            "Authorization": `OAuth ${token}`
        },
        validateStatus: () => true
    });

    if (res.status === 200) {
        return {
            login: res.data.login,
            userId: res.data.user_id
        }
    } else {
        throw new Error("Couldnt validate the new token from twitch!" + res.data.toString());
    }
}