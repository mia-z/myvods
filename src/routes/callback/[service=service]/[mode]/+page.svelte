<script lang="ts">
	import { onMount } from "svelte";
    import { page } from "$app/stores";
    import Fa from "svelte-fa";
    import { faGoogle, faTwitch } from "@fortawesome/free-brands-svg-icons";
    import { faSpinner } from "@fortawesome/free-solid-svg-icons";
	import { setupGoogleAuth } from "$lib/GoogleAuthHelper";
	import { setupTwitchAuth } from "$lib/TwitchAuthHelper";
	import { AxiosError } from "axios";

    let { mode, service } = $page.params;

    let loginError: string | null = null;

    onMount(async () => {
        const code = $page.url.searchParams.get("code");
        
        if (!code) {
            throw new Error("OAuth provider didnt return a code!");
        }

        try {
            switch (service) {
                case "google": await setupGoogleAuth(code, mode); break;
                case "twitch": await setupTwitchAuth(code, mode); break;
                default: throw new Error("Unsupported OAuth provider (This shouldnt ever happen lol)");
            }
        } catch (e) {
            if (e instanceof AxiosError) {
                console.log( e);
                console.log( e.response?.data);
                loginError = e.response?.data?.message
            } else {
                loginError = "Unknown error!"
            }
        }
    });

</script>

<div class="min-h-screen w-full flex flex-col">
    <div class={"flex flex-col w-96 mx-auto rounded-[2.5rem] shadow-lg my-auto bg-base-300 py-5"}>
        <div class={"select-none font-lobster text-2xl mb-5 font-bold text-center"}>
            My<span class={"text-indigo-400"}>Vods</span>
        </div>
        {#if loginError}
            <div class={"mx-auto text-2xl font-bold text-red-400 mb-5"}>
                Error!
            </div>
            <div class={"mx-auto px-10"}>
                <div class={"border-2 p-4 border-gray-800 bg-base-200 text-sm font-roboto-monospace text-center font-bold"}>
                    {loginError}
                </div>
            </div>
        {:else}
            <div class={"mx-auto text-xl"}>
                Setting up auth for&nbsp;<span class={"font-bold capitalize"}>{service}</span>
            </div>
            <Fa icon={faSpinner} class={"text-2xl animate-spin"} />
        {/if}
    </div>
</div>
