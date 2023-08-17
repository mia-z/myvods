<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import Fa from "svelte-fa";
    import { faXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";

    export let open: boolean;
    export let canDismiss: boolean = true;
    export let centered: boolean = false;

    const onDismiss = () => {
        if (open && canDismiss) {
            open = false;
        }
    }

    const onKeyUp = (e: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }) => {
        if (e.key === "Escape") {
            onDismiss();
        }
    }
</script>

{#if open}
    <div role={"dialog"} transition:fade on:click={() => onDismiss()} on:keyup={onKeyUp} class={`absolute top-0 left-0 h-[100vh] w-[100vw] backdrop-blur-sm`}>
        <div class={"py-5 h-full flex"}>
            <div role={"backdrop"} on:click|stopPropagation on:keydown|stopPropagation transition:fly={{ y: 50 }} class={`m-auto bg-neutral rounded-md shadow-xl container xl:w-1/2 relative ${open && !canDismiss ? "border-accent border-2 cursor-wait" : ""} `}>
                {#if open && !canDismiss}
                    <div transition:fade class={"absolute top-0 left-0 h-full w-full backdrop-blur-sm z-40 rounded-lg flex flex-col gap-y-2"}>
                        <div class={"text-accent mt-auto mx-auto  z-50"}>
                            <span class={"loading loading-spinner"}></span>
                        </div>
                        <div class={"mb-auto mx-auto text-xl text-primary-content"}>
                            <slot name="no-dismiss-text" />
                        </div>
                    </div>
                {/if}
                <div class={"flex flex-col"}>
                    <div class={"h-10 rounded-t-md p-1"}>
                        <div class={"flex px-2 h-full rounded-t-sm w-full"}>
                            <h3 class={"my-auto select-none line-clamp-1 w-fit text-xl cursor-pointer text-neutral-content hover:bg-neutral-focus rounded-md transition-all p-1 px-2 font-bold"}>
                                <slot name="title" />
                            </h3>
                            <div class={"my-auto select-none ml-auto flex rounded-full transition-all cursor-pointer w-8 h-8 active:bg-neutral hover:bg-neutral-focus"}>
                                <button class={"text-center m-auto"} on:click={() => onDismiss()}>
                                    <Fa icon={faXmark} class={"text-white"} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class={"my-1 px-3 divider"}>
                    </div>
                    <div class={"min-h-6 text-neutral-content p-3"}>
                        <slot name="content" />
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}