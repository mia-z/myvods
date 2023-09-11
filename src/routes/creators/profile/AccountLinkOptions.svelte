<script lang="ts">
    import { faSpinner } from "@fortawesome/free-solid-svg-icons";
    import { UserData, oAuthConnectionCount } from "$stores/User.store";
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
                await TwitchAuth.revoke($TwitchAuth.token);
                UserData.removeOAuth("Twitch");
            } break;
            case "GOOGLE": {
                await trpc().user.removeOAuth.mutate({ provider: "GOOGLE", userId: $UserData.id });
                await GoogleAuth.revoke($GoogleAuth.token);
                UserData.removeOAuth("Google");
            } break;
            default: throw Error("Provider to unlink isnt valid");
        }
        unlinking = false;
        unlinkModalOpen = false;
    }
</script>

<div class={"text-center font-roboto font-bold text-xl"}>
    Account Link
</div>

<div class={"flex flex-col mt-5"}>
    <a href={GoogleOAuthUrl(true).href} role={"button"} class={`btn w-80 btn-circle mx-auto ${$GoogleAuth.user ? "btn-neutral pointer-events-none" : "btn-outline"}`}>
        {#if !$UserData}
            <Fa icon={faSpinner} class={"animate-spin"} />
        {:else}
            <Fa icon={faGoogle} />
            <div>
                {$GoogleAuth.user ? `Google linked` : `Link Google`}
            </div>
        {/if}
    </a>
    {#if $GoogleAuth.user}
        <div role={"button"} on:click={() => onUnlinkClick("GOOGLE")} class={"text-center text-[10px] hover:cursor-pointer hover:underline"}>
            Unlink?
        </div>
    {/if}
</div>

<div class={"flex flex-col mt-5"}>
    <a href={TwitchOAuthUrl(true).href} role={"button"} class={`btn w-80 btn-circle mx-auto ${$TwitchAuth.user ? "btn-neutral pointer-events-none" : "btn-outline"}`}>
        {#if !$UserData}
            <Fa icon={faSpinner} class={"animate-spin"} />
        {:else}
            <Fa icon={faTwitch} />
            <div>
                {$TwitchAuth.user ? `Twitch linked` : `Link Twitch`}
            </div>
        {/if}
    </a>
    {#if $TwitchAuth.user}
        <div role={"button"} on:click={() => onUnlinkClick("TWITCH")} class={"text-center text-[10px] hover:cursor-pointer hover:underline"}>
            Unlink?
        </div>
    {/if}
</div>

<dialog open={unlinkModalOpen} on:close={() => unlinkModalOpen = false} id="unlink-modal" class={"modal backdrop-blur-sm"}>
    <div class="modal-box">
        {#if $oAuthConnectionCount > 1}
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
        {:else}
            <h3 class="font-bold text-lg text-center">Cant unlink</h3>
            <p class="text-center">You must have at least one account linked</p>
            <div class={"flex flex-row space-x-10 justify-center mt-5"}>
                <button class={`btn w-1/3 btn-neutral`} on:click={() => unlinkModalOpen = false}>
                    Close
                </button>
            </div>
        {/if}
    </div>
    <form method="dialog" class="modal-backdrop">
        <button class={`${unlinking ? "pointer-events-none" : ""} `}>close</button>
    </form>
</dialog>