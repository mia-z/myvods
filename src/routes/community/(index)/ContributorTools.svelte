<script lang="ts">
    import Modal from "$components/Modal.svelte";
    import { faPenToSquare, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
    import type { CommunityCreator } from "@prisma/client";
    import Fa from "svelte-fa";
	import { fade, slide } from "svelte/transition";
	import type { PageData } from "./$types";
	import { invalidateAll } from "$app/navigation";
	import { trpc } from "$trpc/client";
	import NewCreatorForm from "./NewCreatorForm.svelte";
	import EditCreatorForm from "./EditCreatorForm.svelte";
	import { TRPCClientError } from "@trpc/client";
	import { error } from "$lib/toast";

    export let data: PageData;
    
    let toolsModalOpen: boolean = false;

    let creatorFormOpen: boolean = false;

    let editingId: number = -1;
    const onEditClick = async (creatorId: number) => {
        editingId = creatorId
    }

    let deleteLoading: boolean = false;
    let deletingId: number = -1;
    const onDeleteClick = async (creatorId: number) => {
        try {
            deletingId = creatorId;
            await trpc().contributor.deleteCommunityCreator.mutate(creatorId);
            await invalidateAll();
        } catch (e) {
            console.log(e)
            if (e instanceof TRPCClientError) {
                error(e.message);
            }
        } finally {
            deletingId = -1;
        }
    }

</script>

<button on:click={() => { toolsModalOpen = true; }} class={"absolute top-5 right-5 btn btn-neutral rounded-full"}>
    <Fa icon={faPenToSquare} />&nbsp;Community Tools
</button>

<Modal bind:open={toolsModalOpen}>
    <div slot="title">
        Community Tools - Manage Creators
    </div>
    <div slot="content" class={"transition-all"}>
        <div class={"flex flex-col rounded-2xl bg-base-100 p-5"}>
            <label role={"button"} class:btn-error={creatorFormOpen} class={"swap btn btn-neutral"}>
                <input bind:checked={creatorFormOpen} type="checkbox" />
                <div class={"swap-on"}>
                    Close
                </div>
                <div class={"swap-off"}>
                    New creator
                </div>
            </label>
            {#if creatorFormOpen}
                <div class={"flex flex-col bg-neutral mt-4 rounded-xl p-3"} transition:slide>
                    <NewCreatorForm newCreatorForm={data.newCreatorForm} />
                </div>
            {/if}
        </div>
        <div class={"divider"}></div>
        <div class={"text-xl font-bold text-center text-white"}>Community Managed Creators</div>
        <div class={"flex flex-col transition-all"}>
            <table class={"table table-sm"}>
                <thead>
                    <tr class={`grid grid-cols-12`}>
                        <th class={"col-span-1"}>
                            id
                        </th>
                        <th class={"col-span-2"}>
                            Name
                        </th>
                        <th class={"col-span-5"}>
                            Description
                        </th>
                        <th class={"col-span-3"}>
                            Image URL
                        </th>
                        <th class={"col-span-1"}>
                            <!--Edit icon-->
                            <!--Delete icon-->
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.communityCreators as creator}
                        <tr class={`hover grid grid-cols-12 relative`}>
                            {#if deleteLoading && deletingId === creator.id}
                                <div transition:fade class={"absolute z-30 overflow-hidden top-0 left-0 h-full w-full bg-[rgba(21,21,21,0.1)] backdrop-blur-sm rounded-full flex"}>
                                    <Fa class={"m-auto text-blue-400 blur-none text-xl animate-spin"} icon={faSpinner} />
                                </div>
                            {/if}
                            {#if editingId === creator.id}
                                <td class={"col-span-12"}>
                                    <EditCreatorForm editCreatorForm={data.editCreatorForm} bind:editingId {creator} />
                                </td>
                            {:else}
                                <td class={"col-span-1"}>
                                    {creator.id}
                                </td>
                                <td class={"col-span-2"}>
                                    {creator.name}
                                </td>
                                <td class={"col-span-5 truncate"}>
                                    {creator.description}
                                </td>
                                <td class={"col-span-3 truncate"}>
                                    <a class={"hover:underline hover:text-blue-400"} target={"_blank"} href={creator.imageLink}><span class={"truncate"}>{creator.imageLink}</span></a>
                                </td>
                                <td class={"col-span-1 flex flex-row gap-x-3"}>
                                    <button on:click={() => onEditClick(creator.id)}>
                                        <Fa class={"hover:text-warning hover:cursor-pointer"} icon={faPenToSquare} />
                                    </button>
                                    <button on:click={() => deletingId = creator.id}>
                                        <Fa class={"hover:text-error hover:cursor-pointer"} icon={faTrash} />
                                    </button>
                                </td>
                            {/if}
                        </tr>
                        {#if deletingId === creator.id && !deleteLoading}
                            <tr transition:slide class={`grid grid-cols-12 relative mb-1 rounded-b-lg bg-error`}>
                                <td class={"col-span-12 flex flex-row justify-center space-x-2"}>
                                    <div class={"text-error-content font-bold text-lg my-auto"}>
                                        Are you sure you want to delete the above Creator?
                                    </div>
                                    <button on:click={() => onDeleteClick(creator.id)} class={"btn btn-sm btn-warning"}>
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