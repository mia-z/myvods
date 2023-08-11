<script lang="ts">
    import { GoogleAuth } from "$stores/GoogleAuth.store";
	import { TwitchAuth } from "$stores/TwitchAuth.store";
    import { onMount } from "svelte";
    import * as Cookies from "es-cookie";
	import { goto } from "$app/navigation";
	import { useQuery } from "@sveltestack/svelte-query";
    import axios from "axios";
	import { fade } from "svelte/transition";
	import { UserData } from "$stores/User.store";

    onMount(async () => {
        const uuidCookie = Cookies.get("user");
        if (!uuidCookie) {
            console.log("No uuid cookie, cya");
            goto("/");
        } else {
            await UserData.init();
        }
    });

    $: {
        if ($UserData) {
            const twitchOAuthData = $UserData.oauthConnections.find(x => x.provider === "TWITCH");
            if (twitchOAuthData) {
                TwitchAuth.init(twitchOAuthData.refreshToken).then(() => {
                    console.log("Registered Twitch OAuth data");
                });
            }

            const googleOAuthData = $UserData.oauthConnections.find(x => x.provider === "GOOGLE");
            if (googleOAuthData) {
                GoogleAuth.init(googleOAuthData.refreshToken).then(() => {
                    console.log("Registered Google OAuth data");
                });
            }
        }
    }

    const onSignOutClick = async () => {
        const signOutRes = await axios.post(`/api/google/auth/revoke?token=${$GoogleAuth.token}`, null, {
            validateStatus: () => true
        });
        goto("/");
    }
</script>

<header class={"grid grid-cols-5 grid-flow-row h-12 bg-base-300"}>
    <div class={"col-start-3 col-span-1 m-auto"}>
        <h1 class={"text-3xl font-lobster select-none"}>
            My<span class={"font-bold text-indigo-500"}>Vods</span>
        </h1>
    </div>
    <div class={"col-start-4 col-span-1 flex "}>
        <div>
            {$UserData?.displayName}
        </div>
    </div>
    <div class={"col-start-5 col-span-1 flex "}>
        <button on:click={onSignOutClick} class={"m-auto btn btn-secondary btn-sm rounded-full"}>
            <div>
                Sign out
            </div>
        </button>
    </div>
</header>
<main class={"min-h-[calc(100vh-3rem)] w-full flex flex-col"}>
    <slot />
</main>
