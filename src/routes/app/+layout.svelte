<script lang="ts">
    import { GoogleAuth } from "$stores/GoogleAuth.store";
	import { TwitchAuth } from "$stores/TwitchAuth.store";
    import { onMount } from "svelte";
    import * as Cookies from "es-cookie";
	import { goto } from "$app/navigation";
	import { useQuery } from "@sveltestack/svelte-query";
    import axios from "axios";
	import { fade } from "svelte/transition";

    onMount(() => {
        const googleCode = Cookies.get("google_code");
        const twitchCode = Cookies.get("twitch_code");
        if (googleCode || twitchCode) {
            GoogleAuth.init();
            TwitchAuth.init();
        } else {
            goto("/");
        }
    });

    const onSignOutClick = async () => {
        const signOutRes = await axios.post(`/api/google/auth/revoke?token=${$GoogleAuth.token}`, null, {
            validateStatus: () => true
        });
        Cookies.remove("google_code");
        Cookies.remove("google_refresh");
        goto("/");
    }

    // $: userQuery = useQuery({
    //     queryKey: ["user", $GoogleAuth.token],
    //     queryFn: async () => {
    //         const res = await axios.get<Youtube.ChannelListResponse>(`https://www.googleapis.com/youtube/v3/channels?mine=true&part=snippet,contentDetails,statistics&key=${PUBLIC_YOUTUBE_API_KEY}`, {
    //             headers: {
    //                 "Authorization": `Bearer ${$GoogleAuth.token}`
    //             }
    //         });
    //         if (res.data.items[0]) {
    //             return res.data.items[0];
    //         } else {
    //             throw Error("No default channel data found!");
    //         }
    //     },
    //     onError: async (err: AxiosError) => {
    //         console.log(err, "woah!!");
    //     },
    //     enabled: $GoogleAuth.token !== "",
    //     refetchInterval: false,
    //     refetchOnWindowFocus: false
    // });
</script>

<header class={"grid grid-cols-5 grid-flow-row h-12 bg-base-300"}>
    <div class={"col-start-3 col-span-1 m-auto"}>
        <h1 class={"text-3xl lobster select-none"}>
            My<span class={"font-bold text-indigo-500"}>Vods</span>
        </h1>
    </div>
    <!-- <div class={"col-start-4 col-span-1 grid place-items-center"}>
        {#if $userQuery.isLoading || $userQuery.isFetching}
            <div transition:fade class={"ml-auto h-full col-start-1 row-start-1 flex flex-col space-y-1 py-1"}>
                <div class={"flex flex-row space-x-2 mt-auto h-2/5 ml-auto"}>
                    <div class={"bg-slate-700 rounded-md animate-pulse w-16"} />
                    <div class={"bg-slate-700 rounded-md animate-pulse w-6"} />
                    <div class={"bg-slate-700 rounded-md animate-pulse w-12"} />
                </div>
                <div class={"flex flex-row space-x-2 mb-auto h-2/5 ml-auto"}>
                    <div class={"bg-slate-700 rounded-md animate-pulse w-28"} />
                    <div class={"bg-slate-700 rounded-md animate-pulse w-20"} />
                    <div class={"bg-slate-700 rounded-md animate-pulse w-8"} />
                </div>
            </div>
        {:else if $userQuery.isSuccess}
            <div transition:fade class={"ml-auto roboto col-start-1 row-start-1 flex flex-col"}>
                <div class={"text-right"}>
                    {$userQuery.data.snippet.title}
                </div>
                <div class={"text-right text-sm opacity-70"}>
                    Subscribers: {$userQuery.data.statistics.subscriberCount}
                </div>
            </div>
        {:else if $userQuery.isError || $userQuery.isRefetchError || $userQuery.isLoadingError}
            <div class={"ml-auto roboto col-start-1 row-start-1 flex flex-col"}>
                Error authenticating - refresh
            </div>
        {/if}
    </div> -->
    <div class={"col-start-5 col-span-1 flex "}>
        <button on:click={onSignOutClick} class={"m-auto btn btn-secondary btn-sm rounded-full"}>
            <div>
                Sign out
            </div>
        </button>
    </div>
</header>
{$TwitchAuth.userData.login}
<main class={"min-h-[calc(100vh-3rem)] w-full flex flex-col"}>
    <slot />
</main>
