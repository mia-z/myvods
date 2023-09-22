<script lang="ts">
    import { page } from "$app/stores";
	import { onMount } from "svelte";
	import type { PageData, PageServerData } from "./$types";
	import { trpc } from "$trpc/client";
	import ContributorTools from "./ContributorTools.svelte";
	import { DateTime, Duration } from "luxon";
    
    export let data: PageData;
</script>

<div class={"grid grid-cols-3 grid-flow-row"}>
    {#each data.communityCreatorAndVods.vods as vod}
        <a href={`/community/${data.communityCreatorAndVods.slug}/${vod.slug}`} class={`card group card-compact col-span-1 image-full bg-base-200 shadow-xl hover:scale-105 active:scale-100 transition-all hover:cursor-pointer select-none ${vod.service === "Youtube" ? "border-red-500 border-2" : vod.service === "Kick" ? "border-2 border-green-200" : vod.service === "Rumble" ? "border-2 border-green-500" : ""}`}>
            <figure><img class={"min-h-[8rem] max-h-32"} src={vod.videoThumbUrl} alt={"Streamer"} /></figure>
            <div class={"card-body flex flex-col"}>
                <div class={"text-lg font-bold text-white group-hover:underline line-clamp-2"}>{vod.videoTitle}</div>
                <div class={"flex flex-col mt-auto"}>
                    <div class={"text-xs italic text-right"}>
                        Duration: {Duration.fromISO(vod.duration).toFormat("h:m:s")}
                    </div>
                    <div class={"text-xs italic text-right"}>
                        Date Streamed: {DateTime.fromISO(vod.dateRecorded).toFormat("yyyy-LLL-dd")}
                    </div>
                </div>
            </div>
        </a>
    {/each}
</div>

{#if data.communityContributorNick}
    <ContributorTools {data} />
{/if}