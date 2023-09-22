<script lang="ts">
    import type { PageData } from "./$types";
	import ContributorTools from "./ContributorTools.svelte";
    
    export let data: PageData;
</script>

<div class={"grid grid-cols-2 lg:grid-cols-3 gap-3 grid-flow-row"}>
    {#each data.communityCreators as creator}
        <a href={`/community/${creator.slug}`} class={"card group card-compact col-span-1 image-full bg-base-200 shadow-xl hover:scale-105 active:scale-100 transition-all hover:cursor-pointer select-none"}>
            <figure><img class={"min-h-[7rem] max-h-28"} src={creator.imageLink} alt={"Streamer"} /></figure>
            <div class={"card-body line-clamp-4"}>
                <h2 class={"card-title font-bold text-white group-hover:underline"}>{creator.name}</h2>
                <p>{creator.description}</p>
            </div>
        </a>
    {/each}
</div>

{#if data.communityContributorNick}
    <ContributorTools {data} />
{/if}

