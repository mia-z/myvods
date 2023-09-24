<script lang="ts">
	import type { PageData, PageServerData } from "./$types";
	import { trpc } from "$trpc/client";
	import ContributorTools from "./ContributorTools.svelte";
	import { DateTime, Duration } from "luxon";
    import { Query } from "@sveltestack/svelte-query";
	import Fa from "svelte-fa";
	import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
    import { page } from "$app/stores";

    export let data: PageData;

    $: pageNumber = 1;
</script>

<Query options={{
    queryKey: ["vods", pageNumber],
    queryFn: () => trpc($page).community.getCommunityCreatorWithVodsAndCount.query({ creatorId: data.communityCreator.id, offset: pageNumber }),
    keepPreviousData: true
}}>
    <div class={"flex flex-col"} slot="query" let:queryResult>
        {#if queryResult.status === "error"}
            error
        {:else if queryResult.status === "loading"}
            loading
        {:else if !queryResult.data}
            none
        {:else}
            <div class={"grid grid-cols-3 grid-flow-row gap-3"}>
                {#each queryResult.data.vods as vod}
                    <a href={`/community/${data.communityCreator.slug}/${vod.slug}`} class={`card group card-compact col-span-1 image-full bg-base-200 shadow-xl hover:scale-105 active:scale-100 transition-all overflow-hidden hover:cursor-pointer select-none ${vod.service === "Youtube" ? "border-red-500 border-2" : vod.service === "Kick" ? "border-2 border-green-600" : vod.service === "Rumble" ? "border-2 border-green-300" : vod.service === "Twitch" ? "border-2 border-purple-500" : ""}`}>
                        <figure><img class={"min-h-[8rem] max-h-32"} src={vod.videoThumbUrl} alt={"Streamer"} /></figure>
                        <div class={"card-body flex flex-col"}>
                            <div class={"text-lg font-bold text-white group-hover:underline line-clamp-2"}>{vod.videoTitle}</div>
                            <div class={"flex flex-col mt-auto"}>
                                <!-- <div class={"text-xs italic text-right"}>
                                    Duration: {Duration.fromISO(vod.duration).toFormat("h:m:s")}
                                </div> -->
                                <div class={"text-xs italic text-right"}>
                                    Date Streamed: {DateTime.fromISO(vod.dateRecorded).toFormat("yyyy-LLL-dd")}
                                </div>
                            </div>
                        </div>
                    </a>
                {/each}
            </div>
            <div class={"flex flex-row justify-center mt-5 space-x-3"}>
                <button on:click={() => { pageNumber -= 1 }} disabled={pageNumber === 1} class={"btn btn-neutral rounded-full"}>
                    <Fa icon={faArrowLeft} />
                </button>
                <div class={"flex p-3 bg-neutral rounded-xl w-20 select-none"}>
                    <div class={"m-auto"}>
                        Page:&nbsp;{pageNumber}
                    </div>
                </div>
                <button disabled={((pageNumber * 9)  + 9 >= queryResult.data._count.vods) || queryResult.isPreviousData} on:click={() => { pageNumber += 1 }} class={"btn btn-neutral rounded-full"}>
                    <Fa icon={faArrowRight} />
                </button>
            </div>
        {/if}
    </div>
</Query>

{#if data.communityContributorNick}
    <ContributorTools {data} />
{/if}