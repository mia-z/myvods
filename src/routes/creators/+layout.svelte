<script lang="ts">
    import { GoogleAuth } from "$stores/GoogleAuth.store";
	import { TwitchAuth } from "$stores/TwitchAuth.store";
    import { onMount } from "svelte";
    import * as Cookies from "es-cookie";
	import { goto } from "$app/navigation";
	import { UserData } from "$stores/User.store";
    import { faRightFromBracket, faUserGear } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
	import type { LayoutServerData } from "./$types";

    export let data: LayoutServerData;
    UserData.init(data);

    onMount(async () => {
        if ($UserData) {
            if ($UserData.oauthConnections.TWITCH) {
                TwitchAuth.init($UserData.oauthConnections.TWITCH.refreshToken).then(() => {
                    console.log("Registered Twitch OAuth data");
                });
            }

            if ($UserData.oauthConnections.GOOGLE) {
                GoogleAuth.init($UserData.oauthConnections.GOOGLE.refreshToken).then(() => {
                    console.log("Registered Google OAuth data");
                });
            }
        }
    });

    // $: {
    //     if ($UserData) {
    //         if ($UserData.oauthConnections.Twitch) {
    //             TwitchAuth.init($UserData.oauthConnections.Twitch.refreshToken).then(() => {
    //                 console.log("Registered Twitch OAuth data");
    //             });
    //         }

    //         if ($UserData.oauthConnections.Google) {
    //             GoogleAuth.init($UserData.oauthConnections.Google.refreshToken).then(() => {
    //                 console.log("Registered Google OAuth data");
    //             });
    //         }
    //     }
    // }

    const onSignOutClick = async () => {
        Cookies.remove("user");
        Cookies.remove("gid");
        Cookies.remove("tid");
        goto("/");
    }

    const onUserSettingsClick = () => {
        goto("/app/profile");
    }
</script>

<header class={"grid grid-cols-5 grid-flow-row h-12 bg-base-300"}>
    <div class={"col-start-3 col-span-1 m-auto"}>
        <h1 role={"link"} on:click={() => goto("/app")} class={"hover:underline hover:cursor-pointer text-3xl font-lobster select-none"}>
            My<span class={"font-bold text-indigo-500"}>Vods</span>
        </h1>
    </div>
    <div class={"col-start-5 col-span-1 flex flex-row justify-end mr-5 space-x-2"}>
        <button on:click={onUserSettingsClick} class={"my-auto btn btn-base btn-sm rounded-full"}>
            <Fa icon={faUserGear} />
            {$UserData?.displayName}
        </button>
        <button on:click={onSignOutClick} class={"my-auto btn btn-base btn-sm rounded-full"}>
            <Fa icon={faRightFromBracket} />
        </button>
    </div>
</header>
<main class={"min-h-[calc(100vh-3rem)] w-full flex flex-col"}>
    <slot />
</main>
