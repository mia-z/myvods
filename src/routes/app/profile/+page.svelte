<script lang="ts">
	import Box from "$components/Box.svelte";
    import { faCog, faSpinner } from "@fortawesome/free-solid-svg-icons";
    import { UserData } from "$stores/User.store";
    import { GoogleAuth } from "$stores/GoogleAuth.store";
    import { TwitchAuth } from "$stores/TwitchAuth.store";
    import { GoogleOAuthUrl, TwitchOAuthUrl } from "$lib/AuthUrlHelper";
	import { faGoogle, faTwitch } from "@fortawesome/free-brands-svg-icons";
	import Fa from "svelte-fa";
	import { trpc } from "$trpc/client";

    let unlinkModalOpen: boolean = false;
    let unlinking: boolean = false;
    let providerToUnlink: "TWITCH" | "GOOGLE";

    const onUnlinkClick = (provider: "TWITCH" | "GOOGLE") => {
        providerToUnlink = provider;
        unlinkModalOpen = true;
    }

    const onUnlinkConfirm = async () => {
        unlinking = true;
        switch(providerToUnlink) {
            case "TWITCH": {
                await trpc().user.removeOAuth.mutate({ provider: "TWITCH", userId: $UserData.id });
                await TwitchAuth.revoke($TwitchAuth.token); break;
            }
            case "GOOGLE": {
                await trpc().user.removeOAuth.mutate({ provider: "GOOGLE", userId: $UserData.id });
                await GoogleAuth.revoke($GoogleAuth.token); break;
            }
            default: throw Error("");
        }
        unlinking = false;
        unlinkModalOpen = false;
    }
</script>

<Box as={"div"} icon={faCog} >
    <div class={"text-center font-roboto font-bold text-2xl"}>
        Profile Settings
    </div>
    <div class={"divider"}></div>
    <div class={"text-center font-roboto font-bold text-xl"}>
        Account Link
    </div>

    <div class={"flex flex-col mt-5"}>
        <a href={GoogleOAuthUrl(true).href} role={"button"} class={`btn w-80 btn-circle mx-auto ${$GoogleAuth.user ? "btn-outline pointer-events-none" : "btn-neutral"}`}>
            {#if !$UserData}
                <Fa icon={faSpinner} class={"animate-spin"} />
            {:else}
                <Fa icon={faGoogle} />
                <div>
                    {$GoogleAuth.user ? `Google linked as: ${$GoogleAuth.user?.names[0].displayName}` : `Link Google`}
                </div>
            {/if}
        </a>
        <div role={"button"} on:click={() => onUnlinkClick("GOOGLE")} class={"text-center text-[10px] hover:cursor-pointer hover:underline"}>
            Unlink?
        </div>
    </div>

    <div class={"flex flex-col mt-5"}>
        <a href={TwitchOAuthUrl(true).href} role={"button"} class={`btn w-80 btn-circle mx-auto ${$TwitchAuth.user ? "btn-outline pointer-events-none" : "btn-neutral"}`}>
            {#if !$UserData}
                <Fa icon={faSpinner} class={"animate-spin"} />
            {:else}
                <Fa icon={faTwitch} />
                <div>
                    {$TwitchAuth.user ? `Twitch linked as: ${$TwitchAuth.user?.display_name}` : `Link Twitch`}
                </div>
            {/if}
        </a>
        <div role={"button"} on:click={() => onUnlinkClick("TWITCH")} class={"text-center text-[10px] hover:cursor-pointer hover:underline"}>
            Unlink?
        </div>
    </div>
</Box>

<dialog open={unlinkModalOpen} on:close={() => unlinkModalOpen = false} id="unlink-modal" class={"modal backdrop-blur-sm"}>
    <div class="modal-box">
        <h3 class="font-bold text-lg text-center">Are you sure you want to unlink your <span class={"uppercase"}>{providerToUnlink}</span> account?</h3>
        <div class={"flex flex-row space-x-10 justify-center mt-10"}>
            <button class={`btn w-1/3 btn-neutral ${unlinking ? "pointer-events-none" : ""}`} on:click={() => unlinkModalOpen = false}>
                Cancel
            </button>
            <button class={`btn w-1/3 btn-error ${unlinking ? "pointer-events-none" : ""}`} on:click={() => onUnlinkConfirm()}>
                {#if unlinking}
                    <Fa icon={faSpinner} class={"animate-spin"} />
                {:else}
                    Unlink
                {/if}
            </button>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button class={`${unlinking ? "pointer-events-none" : ""} `}>close</button>
    </form>
</dialog>
