<script lang="ts">
	import { faPenToSquare, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
    import type { PageData } from "./$types";
	import Fa from "svelte-fa";
	import Modal from "$components/Modal.svelte";
	import { fade, slide } from "svelte/transition";
	import { TRPCClientError } from "@trpc/client";
	import { invalidateAll } from "$app/navigation";
	import { trpc } from "$trpc/client";
	import NewVodForm from "./NewVodForm.svelte";
    import { Duration, DateTime } from "luxon";

    export let data: PageData;

    let toolsModalOpen: boolean = false;

    let newVodFormOpen: boolean = false;

    let deletingId: number = -1;
    let deleteLoading: boolean = false;
    const onDeleteClick = async (vodId: number) => {
        try {
            deleteLoading = true;
            await trpc().contributor.deleteCommunityVod.mutate(vodId);
            await invalidateAll();
        } catch (e) {
            console.log(e)
            if (e instanceof TRPCClientError) {
                //error(e.message);
            }
        } finally {
            deletingId = -1;
            deleteLoading = false;
        }
    }
</script>

<button on:click={() => { toolsModalOpen = true; }} class={"absolute top-5 right-5 btn btn-neutral rounded-full"}>
    <Fa icon={faPenToSquare} />&nbsp;Community Tools
</button>

<Modal bind:open={toolsModalOpen}>
    <div slot="title">
        Community Tools - Manage VODs for {data.communityCreatorAndVods.name}
    </div>
    <div slot="content" class={"transition-all"}>
        <div class={"flex flex-col rounded-2xl bg-base-100 p-5"}>
            <label role={"button"} class:btn-error={newVodFormOpen} class={"swap btn btn-neutral"}>
                <input bind:checked={newVodFormOpen} type="checkbox" />
                <div class={"swap-on"}>
                    Close
                </div>
                <div class={"swap-off"}>
                    New VOD
                </div>
            </label>
            {#if newVodFormOpen}
                <div class={"flex flex-col bg-neutral mt-4 rounded-xl p-3"} transition:slide>
                    <NewVodForm {data} />
                </div>
            {/if}
        </div>
        <div class={"divider"}></div>
        <div class={"text-xl font-bold text-center text-white"}>Community Managed VODs For {data.communityCreatorAndVods.name}</div>
        <div class={"flex flex-col transition-all"}>
            <table class={"table table-sm"}>
                <thead>
                    <tr class={`grid grid-cols-12`}>
                        <th class={"col-span-1"}>
                            id
                        </th>
                        <th class={"col-span-4"}>
                            Title
                        </th>
                        <th class={"col-span-2"}>
                            Platform ID
                        </th>
                        <th class={"col-span-2"}>
                            Duration 
                        </th>
                        <th class={"col-span-2"}>
                            Date 
                        </th>
                        <th class={"col-span-1"}>
                            <!--Edit icon-->
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.communityCreatorAndVods.vods as vod}
                        <tr class={`hover grid grid-cols-12 relative`}>
                            {#if deleteLoading && deletingId === vod.id}
                                <div transition:fade class={"absolute z-30 overflow-hidden top-0 left-0 h-full w-full bg-[rgba(21,21,21,0.1)] backdrop-blur-sm rounded-full flex"}>
                                    <Fa class={"m-auto text-blue-400 blur-none text-xl animate-spin"} icon={faSpinner} />
                                </div>
                            {/if}
                            <td class={"col-span-1"}>
                                {vod.id}
                            </td>
                            <td class={"col-span-4 truncate"}>
                                {vod.videoTitle}
                            </td>
                            <td class={"col-span-2"}>
                                {vod.videoId}
                            </td>
                            <td class={"col-span-2"}>
                                {Duration.fromISO(vod.duration).toFormat("h:mm:ss")}
                            </td>
                            <td class={"col-span-2"}>
                                {DateTime.fromISO(vod.dateRecorded).toFormat("yyyy-LLL-dd")}
                            </td>
                            <td class={"col-span-1 flex flex-row gap-x-3"}>
                                <button on:click={() => deletingId = vod.id}>
                                    <Fa class={"hover:text-error hover:cursor-pointer"} icon={faTrash} />
                                </button>
                            </td>
                        </tr>
                        {#if deletingId === vod.id && !deleteLoading}
                            <tr transition:slide class={`grid grid-cols-12 relative mb-1 rounded-b-lg bg-error`}>
                                <td class={"col-span-12 flex flex-row justify-center space-x-2"}>
                                    <div class={"text-error-content font-bold text-lg my-auto"}>
                                        Are you sure you want to delete the above VOD?
                                    </div>
                                    <button on:click={() => onDeleteClick(vod.id)} class={"btn btn-sm btn-warning"}>
                                        Delete
                                    </button>
                                    <button on:click={() => deletingId = -1} class={"btn btn-sm btn-neutral"}>
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        {/if}
                    {/each}
                </tbody>                
            </table>
        </div>
    </div>
</Modal>