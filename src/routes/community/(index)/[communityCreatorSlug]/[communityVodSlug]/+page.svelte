<script lang="ts">
	import type { PageData } from "./$types";
	import { trpc } from "$trpc/client";
	import TwitchPlayer from "$components/TwitchPlayer.svelte";
	import KickPlayer from "$components/KickPlayer.svelte";
	import YoutubePlayer from "$components/YoutubePlayer.svelte";
    import { Duration, DateTime } from "luxon";
	import Sidebar from "$components/Sidebar.svelte";
    import { faListOl, faPenToSquare, faTrash, faSave, faSpinner, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
	import NewAnnotationForm from "./NewAnnotationForm.svelte";
    import { error } from "$lib/toast";
	import EditAnnotationForm from "./EditAnnotationForm.svelte";
	import { fade, slide } from "svelte/transition";
	import { goto, invalidateAll } from "$app/navigation";

    export let data: PageData;

    let leftDrawerOpen: boolean = false;
    let toolsDrawerOpen: boolean = false;

    let setTimestamp: ((seek: number) => Promise<void>);
    let videoDuration: number;
    let currentTime: number;

    let editingAnnotationId: number = -1;

    let deletingId: number = -1;
    let isDeleting: boolean = false;

    const onSkipToClick = (timestamp: number) => {
        const durationObject = Duration.fromMillis(timestamp).shiftTo("seconds").toObject();
        if (durationObject.seconds) {
            setTimestamp(durationObject.seconds);
        } else {
            error("Couldnt seek to that one :(");
        }
    }

    const onDeleteConfirmClick = async (annotationId: number) => {
        isDeleting = true;

        try {
            console.log(annotationId)
            const deleteRes = await trpc().contributor.deleteCommunityVodAnnotation.mutate(annotationId);
            await invalidateAll();
        } catch (e) {
            console.log(e);
        } finally {
            isDeleting = false;
            deletingId = -1;
        }

    }
</script>

<Sidebar bind:open={leftDrawerOpen}>
    <div class={"flex flex-col px-2 py-1 space-y-2 h-full overflow-y-auto styled-scrollbars"}>
        {#each data.communityVodWithAnnotations.annotations.sort((a, b) => {
            return a.timestamp - b.timestamp;
        }) as annotation (annotation.id)}
            <div class={"h-24 min-h-[6rem] border-2 border-base-100 select-none w-full bg-base-300 rounded-xl shadow-lg grid grid-cols-5"}>
                <div class={"col-span-4 flex flex-col pr-2"}>
                    <div class={"subject-container pt-1 pl-2 flex flex-row text-xs"}>
                        <div>
                            Subject:&nbsp;
                        </div>
                        <div class={"italic text-white"}>
                            {annotation.subject || "Memes"}
                        </div>
                    </div>
                    <div class={"note-container pl-2"}>
                        <div class={"line-clamp-2 text-sm font-roboto"}>
                            {annotation.note}
                        </div>
                    </div>
                    <div class={"game-container mt-auto"}>
                        <div class={"text-center pb-1 pl-1  bg-base-100 text-xs rounded-tr-full"}>
                            Playing:&nbsp;{annotation.game || "Nothing"}
                        </div>
                    </div>
                </div>
                <div role={"button"} on:click={() => onSkipToClick(annotation.timestamp)} class={"col-span-1 flex flex-col h-full hover:cursor-pointer active:bg-base-300 hover:bg-base-100 rounded-r-xl group"}>
                    <div class={"text-sm text-center mt-auto"}>
                        Skip-to
                    </div>
                    <div class={"text-sm text-center text-blue-500 mb-auto group-hover:underline"}>
                        {Duration.fromMillis(annotation.timestamp).toFormat("hh:mm:ss")}
                    </div>
                </div>
            </div>
        {/each}
    </div>
</Sidebar>

<!-- {#if data.communityContributorNick}
    <Sidebar side={"right"} width={"w-144"} bind:open={rightDrawerOpen}>
        <div class={"flex flex-col h-full overflow-y-auto styled-scrollbars"}>
            <div class={"w-full flex flex-col"}>
                <NewAnnotationForm currentVodTime={currentTime} {data} />
            </div>
            <div class={"divider divider-vertical px-5"}></div>
            <div class={"text-center text-2xl"}>
                Annotations
            </div>
            <div class={"flex flex-col space-y-2 p-2"}>
                {#each data.communityVodWithAnnotations.annotations.sort((a, b) => {
                    return a.timestamp - b.timestamp;
                }) as annotation (annotation.id)}
                    {#if editingAnnotationId === annotation.id}
                        <EditAnnotationForm bind:editingAnnotationId {data} {annotation} />
                    {:else}
                        <div class={"flex flex-row flex-wrap bg-base-300 p-2 gap-2 rounded-xl relative"}>
                            {#if deletingId === annotation.id}
                                <div transition:fade={{ duration: 150 }} class={"absolute top-0 left-0 w-full h-full backdrop-blur-sm rounded-2xl z-30 flex flex-col justify-center"}>
                                    <div class={"flex bg-neutral flex-col mb-2 mx-5 p-2 rounded-xl"}>
                                        <div class={"text-center text-lg text-white"}>
                                            Are you sure you want to delete annotation at timestamp:
                                        </div>
                                        <div class={"text-center text-lg text-blue-400 underline"}>
                                            {Duration.fromMillis(annotation.timestamp).toFormat("hh:mm:ss")}
                                        </div>
                                    </div>
                                    {#if (isDeleting && annotation.id === deletingId)}
                                        <Fa class={"animate-spin text-3xl"} icon={faSpinner}/>
                                    {:else}
                                        <div class={"flex flex-row space-x-2 justify-center"}>
                                            <button on:click={() => onDeleteConfirmClick(annotation.id)} class={"btn btn-error w-1/3"}>
                                                Delete
                                            </button>
                                            <button on:click={() => deletingId = -1} class={"btn btn-warning w-1/3"}>
                                                Cancel
                                            </button>
                                        </div>
                                    {/if}
                                </div>
                            {/if}
                            <div class={"w-full flex flex-row pr-2"}>
                                <div class={"w-1/2 bg-base-200 rounded-xl text-sm p-1 pl-2 my-auto"}>
                                    <span class={"text-white font-bold"}>Timestamp:</span>&nbsp;{Duration.fromMillis(annotation.timestamp).toFormat("hh:mm:ss")}
                                </div>
                                <div class={"ml-auto pt-1 text-2xl hover:text-warning active:text-yellow-300 hover:cursor-pointer"}>
                                    <div class={"tooltip"} data-tip={"Edit"}>
                                        <button on:click={() => editingAnnotationId = annotation.id}>
                                            <Fa icon={faPenToSquare} />
                                        </button>
                                    </div>
                                </div>
                                <div class={"ml-3 pt-1 text-2xl hover:text-error active:text-red-300 hover:cursor-pointer"}>
                                    <div class={"tooltip"} data-tip={"Delete"}>
                                        <button on:click={() => deletingId = annotation.id}>
                                            <Fa icon={faTrash} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class={"flex-1 flex flex-col"}>
                                <div class={"label-text font-bold pt-1 text-white bg-base-200 rounded-t-xl w-fit px-5 rounded-b-none"}>
                                    Game
                                </div>
                                <div class={"p-1 pl-2 text-center bg-base-200 rounded-xl rounded-tl-none text-sm"}>
                                    {annotation.game || "Nothing"}
                                </div>
                            </div>
                            <div class={"flex-1 flex flex-col"}>
                                <div class={"label-text font-bold pt-1 text-white bg-base-200 rounded-t-xl w-fit px-5 rounded-b-none"}>
                                    Subject
                                </div>
                                <div class={"p-1 pl-2 text-center bg-base-200 rounded-xl rounded-tl-none text-sm"}>
                                    {annotation.subject || "Memes"}
                                </div>
                            </div>
                            <div class={"w-full flex flex-col"}>
                                <div class={"label-text font-bold pt-1 text-white bg-base-200 rounded-t-xl w-fit px-5 rounded-b-none"}>
                                    Note
                                </div>
                                <div class={"p-1 pl-2 bg-base-200 rounded-xl rounded-tl-none text-sm line-clamp-2"}>
                                    {annotation.note}
                                </div>
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    </Sidebar>
{/if} -->

<div class={"w-screen h-screen relative"}>
    <div class={"absolute top-0 left-0 flex"}>
        <div class={"overlay-button-container relative"}>
            <div class={"button-back-wrapper absolute top-[calc(40vh-32px)] left-5"}>
                <div class={"tooltip"} data-tip="Back">
                    <button on:click={() => { goto(".") }} class={"btn btn-neutral rounded-full btn-lg"}>
                        <Fa icon={faArrowLeft} />
                    </button>            
                </div>
            </div>
            <div class={"button-timestamps-wrapper absolute top-[calc(50vh-32px)] left-5"}>
                <div class={"tooltip"} data-tip="Timestamps">
                    <button on:click={() => { leftDrawerOpen = true }} class={"btn btn-neutral rounded-full btn-lg"}>
                        <Fa icon={faListOl} />
                    </button>            
                </div>
            </div>
        </div>
    </div>
    <div class={"flex flex-row h-full w-full overflow-x-hidden"}>
        <div class={"flex-grow"}>
            {#if data.communityVodWithAnnotations.service === "Twitch"}
                <TwitchPlayer videoId={data.communityVodWithAnnotations.videoId} />
            {/if}
            {#if data.communityVodWithAnnotations.service === "Kick"}
                <KickPlayer videoId={data.communityVodWithAnnotations.videoId} />
            {/if}
            {#if data.communityVodWithAnnotations.service === "Youtube"}
                <YoutubePlayer bind:currentTime bind:duration={videoDuration} bind:seek={setTimestamp} videoId={data.communityVodWithAnnotations.videoId} />
            {/if}
        </div>
        {#if data.communityContributorNick}
            <div class={`transition-all tools-wrapper relative ${toolsDrawerOpen ? "w-144" : "w-0"}`}>
                <div class={"absolute top-[calc(50%-40px)] -left-20"}>
                    <div class={"tooltip"} data-tip="Open Tools">
                        <button on:click={() => { toolsDrawerOpen = !toolsDrawerOpen }} class={"btn btn-neutral rounded-full btn-lg "}>
                            <div class={"swap"}>
                                <input type="checkbox" bind:checked={toolsDrawerOpen} />
                                <div class={"swap-on"}>
                                    <Fa icon={faArrowRight} />
                                </div>
                                <div class={"swap-off"}>
                                    <Fa icon={faArrowLeft} />
                                </div>
                            </div>
                        </button>        
                    </div>
                </div>
                <div class={`w-144 flex flex-col h-full overflow-y-auto styled-scrollbars`}>
                    <div class={"w-full flex flex-col"}>
                        <NewAnnotationForm currentVodTime={currentTime} {data} />
                    </div>
                    <div class={"divider divider-vertical px-5"}></div>
                    <div class={"text-center text-2xl"}>
                        Annotations
                    </div>
                    <div class={"flex flex-col space-y-2 p-2"}>
                        {#each data.communityVodWithAnnotations.annotations.sort((a, b) => {
                            return a.timestamp - b.timestamp;
                        }) as annotation (annotation.id)}
                            {#if editingAnnotationId === annotation.id}
                                <EditAnnotationForm bind:editingAnnotationId {data} {annotation} />
                            {:else}
                                <div class={"flex flex-row flex-wrap bg-base-300 p-2 gap-2 rounded-xl relative"}>
                                    {#if deletingId === annotation.id}
                                        <div transition:fade={{ duration: 150 }} class={"absolute top-0 left-0 w-full h-full backdrop-blur-sm rounded-2xl z-30 flex flex-col justify-center"}>
                                            <div class={"flex bg-neutral flex-col mb-2 mx-5 p-2 rounded-xl"}>
                                                <div class={"text-center text-lg text-white"}>
                                                    Are you sure you want to delete annotation at timestamp:
                                                </div>
                                                <div class={"text-center text-lg text-blue-400 underline"}>
                                                    {Duration.fromMillis(annotation.timestamp).toFormat("hh:mm:ss")}
                                                </div>
                                            </div>
                                            {#if (isDeleting && annotation.id === deletingId)}
                                                <Fa class={"animate-spin text-3xl"} icon={faSpinner}/>
                                            {:else}
                                                <div class={"flex flex-row space-x-2 justify-center"}>
                                                    <button on:click={() => onDeleteConfirmClick(annotation.id)} class={"btn btn-error w-1/3"}>
                                                        Delete
                                                    </button>
                                                    <button on:click={() => deletingId = -1} class={"btn btn-warning w-1/3"}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            {/if}
                                        </div>
                                    {/if}
                                    <div class={"w-full flex flex-row pr-2"}>
                                        <div class={"w-1/2 bg-base-200 rounded-xl text-sm p-1 pl-2 my-auto"}>
                                            <span class={"text-white font-bold"}>Timestamp:</span>&nbsp;{Duration.fromMillis(annotation.timestamp).toFormat("hh:mm:ss")}
                                        </div>
                                        <div class={"ml-auto pt-1 text-2xl hover:text-warning active:text-yellow-300 hover:cursor-pointer"}>
                                            <div class={"tooltip"} data-tip={"Edit"}>
                                                <button on:click={() => editingAnnotationId = annotation.id}>
                                                    <Fa icon={faPenToSquare} />
                                                </button>
                                            </div>
                                        </div>
                                        <div class={"ml-3 pt-1 text-2xl hover:text-error active:text-red-300 hover:cursor-pointer"}>
                                            <div class={"tooltip"} data-tip={"Delete"}>
                                                <button on:click={() => deletingId = annotation.id}>
                                                    <Fa icon={faTrash} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class={"flex-1 flex flex-col"}>
                                        <div class={"label-text font-bold pt-1 text-white bg-base-200 rounded-t-xl w-fit px-5 rounded-b-none"}>
                                            Game
                                        </div>
                                        <div class={"p-1 pl-2 text-center bg-base-200 rounded-xl rounded-tl-none text-sm"}>
                                            {annotation.game || "Nothing"}
                                        </div>
                                    </div>
                                    <div class={"flex-1 flex flex-col"}>
                                        <div class={"label-text font-bold pt-1 text-white bg-base-200 rounded-t-xl w-fit px-5 rounded-b-none"}>
                                            Subject
                                        </div>
                                        <div class={"p-1 pl-2 text-center bg-base-200 rounded-xl rounded-tl-none text-sm"}>
                                            {annotation.subject || "Memes"}
                                        </div>
                                    </div>
                                    <div class={"w-full flex flex-col"}>
                                        <div class={"label-text font-bold pt-1 text-white bg-base-200 rounded-t-xl w-fit px-5 rounded-b-none"}>
                                            Note
                                        </div>
                                        <div class={"p-1 pl-2 bg-base-200 rounded-xl rounded-tl-none text-sm line-clamp-2"}>
                                            {annotation.note}
                                        </div>
                                    </div>
                                </div>
                            {/if}
                        {/each}
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>