<script lang="ts">
    import { page } from "$app/stores";
	import { onMount } from "svelte";
	import type { ActionData, PageServerData } from "./$types";
	import { trpc } from "$trpc/client";
	import TwitchPlayer from "$components/TwitchPlayer.svelte";
	import KickPlayer from "$components/KickPlayer.svelte";
	import YoutubePlayer from "$components/YoutubePlayer.svelte";
    import { Duration, DateTime } from "luxon";
	import { invalidateAll } from "$app/navigation";
	import Sidebar from "$components/Sidebar.svelte";
    import { faListOl, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";

    export let data: PageServerData;

    let leftDrawerOpen: boolean = false;
    let rightDrawerOpen: boolean = false;

    let setTimestamp: ((seek: number) => Promise<void>);
    let videoDuration: number;
    let currentTime: number;

    let noteInput: HTMLInputElement;
    let subjectInput: HTMLInputElement;
    let gameInput: HTMLInputElement;
    let hourInput: HTMLInputElement;
    let minuteInput: HTMLInputElement;
    let secondInput: HTMLInputElement;

    const onSubmitNewAnnotation = async () => {
        const newAnnotationRes = await trpc().contributor.createCommunityVodAnnotation.mutate({
            communityVodId: data.communityVodWithAnnotations.id,
            timestamp: Duration.fromObject({ hours: parseInt(hourInput.value), minutes: parseInt(minuteInput.value), seconds: parseInt(secondInput.value) }).as("seconds"),
            note: noteInput.value
        });
        console.log(newAnnotationRes);
        invalidateAll();
    }
</script>

<Sidebar bind:open={leftDrawerOpen}>
    <div>
        {#each data.communityVodWithAnnotations.annotations as annotation}
            {annotation?.note}-<span role={"button"} on:click={() => { setTimestamp(annotation.timestamp) }}>{Duration.fromObject({ seconds: annotation.timestamp }).toFormat("h:mm:ss")}</span><br />
        {/each}
    </div>
</Sidebar>

<Sidebar side={"right"} width={"w-144"} bind:open={rightDrawerOpen}>
    <div class={"flex flex-col"}>
        <div class={"flex flex-row"}>
            <input bind:this={noteInput} type="text" name={"noteInput"} placeholder={"Type annotation note here"} class={"input input-bordered w-full max-w-xs"} />
            <input bind:this={hourInput} min={0} max={23} type="number" name={"hourInput"} placeholder={"Hour"} class={"input input-bordered w-full max-w-xs"} />
            <input bind:this={minuteInput} min={0} max={59} type="number" name={"minuteInput"} placeholder={"Minute"} class={"input input-bordered w-full max-w-xs"} />
            <input bind:this={secondInput} min={0} max={59} type="number" name={"secondInput"} placeholder={"Second"} class={"input input-bordered w-full max-w-xs"} />
        </div>
        <button on:click={onSubmitNewAnnotation} class={"btn btn-block btn-neutral"}>Save</button>
    </div>
</Sidebar>

<div class={"w-screen h-screen relative"}>
    <div class={"absolute top-0 left-0 flex"}>
        <div class={"overlay-button-container relative"}>
            <button on:click={() => { leftDrawerOpen = true }} class={"btn btn-neutral rounded-full btn-lg absolute top-[calc(50vh-32px)] left-5"}>
                <Fa icon={faListOl} />
            </button>
            <button on:click={() => { rightDrawerOpen = true }} class={"btn btn-neutral rounded-full btn-lg absolute top-[calc(50vh-32px)] left-[calc(100vw-6rem)] "}>
                <Fa icon={faPenToSquare} />
            </button>
        </div>
    </div>
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