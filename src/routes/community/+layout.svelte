<script lang="ts">
	import Modal from "$components/Modal.svelte";
	import { trpc } from "$trpc/client";
	import type { LayoutServerData } from "./$types";
	import { fly } from "svelte/transition";
	import { TRPCClientError } from "@trpc/client";
    import * as Cookies from "es-cookie"; 
	import { invalidate, invalidateAll } from "$app/navigation";
    import { fade } from "svelte/transition";

    export let data: LayoutServerData;

    let loginModal: HTMLDialogElement;
    let loginModalOpen = false;
    let loginLoading: boolean = false;
    let loginError: string = "";
    let loginSuccess: boolean = false;
    let nickInput: HTMLInputElement;
    let passwordInput: HTMLInputElement;

    const onLoginClick = async () => {
        loginError = "";
        loginLoading = true;
        try {
            const token = await trpc().contributor.verifyContributor.mutate({
                nick: nickInput.value,
                password: passwordInput.value
            });
            Cookies.set("_c", token);
            loginSuccess = true;
            await invalidateAll();
            setTimeout(() => {
                loginModal.close();
            }, 1500);
        } catch (e) {
            if (e instanceof TRPCClientError) {
                loginError = e.message
            } else {
                loginError = "Error logging in";
            }
            loginLoading = false;
        }
    }

    const onEnterKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            onLoginClick();
        }
    }

</script>

<dialog bind:this={loginModal} id={"login-modal"} class={"modal"}>
    <div class={"modal-box w-72"}>
        <h3 class={"font-bold text-center text-lg mb-3 text-indigo-400"}>Contributor Login</h3>
        <div class={"flex flex-row flex-wrap gap-2"}>
            <input disabled={loginLoading} bind:this={nickInput} placeholder={"Nick"} class={"input input-bordered rounded-full placeholder:italic placeholder:opacity-70 join-item flex-1"} />
            <input on:keypress={onEnterKeyPress} disabled={loginLoading} bind:this={passwordInput} placeholder={"Password"} type={"password"} class={"input input-bordered rounded-full placeholder:italic placeholder:opacity-70 join-item flex-1"} />
            {#if loginError}
                <div transition:fly class={"text-sm text-red-400 italic flex-grow text-center"}>
                    {loginError}
                </div>
            {/if}
            {#if loginSuccess}
                <div transition:fly class={"text-sm text-green-400 italic flex-grow text-center"}>
                    Logged in!
                </div>
            {:else}
                <button disabled={loginLoading && !loginSuccess} class:btn-success={loginSuccess} on:click={onLoginClick} class={"btn btn-block flex-grow btn-neutral rounded-full"}>
                    Login
                </button>
            {/if}
            
        </div>
    </div>
    <form method={"dialog"} class={"modal-backdrop"}>
        <button>close</button>
    </form>
</dialog>

<div class={"flex flex-col min-h-screen"}>
    <div class={"mx-auto my-2 mb-5 rounded-full bg-base-300 px-5 py-3 shadow-lg"}>
        <div class={"select-none font-lobster text-4xl font-bold"}>
            Omni<span class={"text-indigo-400"}>Vods</span>
        </div>
    </div>
    <div class={"container mx-auto lg:w-176"}>
        <slot />
    </div>
    <div class={"mt-auto h-14 flex flex-col bg-base-200 rounded-t-3xl"}>
        <div class={"mt-auto flex flex-row mb-1"}>
            <p class={"flex-1 text-end italic text-xs"}>
                Site developed by
                <span class={"text-pink-400"}>
                    <a href={"https://github.com/mia-z"} target={"_blank"} rel={"noreferrer noopener"}>
                        miaz
                    </a>
                </span>
            </p>
            <div class={"divider divider-horizontal"}></div>
            <p class={"flex-0 text-start italic text-xs"}>
                Data sourced by the Daliban
            </p>
            <div class={"divider divider-horizontal"}></div>
            {#if data.communityContributorNick}
                <p class={"flex-1 text-start text-xs italic text-green-400"}>
                    Contributor logged in: {data.communityContributorNick}
                </p>
            {:else}
                <p role={"button"} on:click={() => loginModal.showModal()} class={"flex-1 text-start text-xs italic hover:cursor-pointer hover:text-blue-400"}>
                    Contributor Login
                </p>
            {/if}
        </div>
        <div class={"mb-auto text-white text-center text-xs left-0 w-full font-open-sans"}>
            Made with ❤️ using <span class={"text-orange-500"}>Svelte</span>Kit        
        </div>
    </div>
</div>
