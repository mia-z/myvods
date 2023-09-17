<script lang="ts">
    import { page } from "$app/stores";
	import { onMount } from "svelte";
	import type { PageData, PageServerData } from "./$types";
	import { trpc } from "$trpc/client";
    
    export let data: PageData;
</script>

<div>
    community vods for {data.communityCreatorAndVods?.name}
</div>
<div>
    {#each data.communityCreatorAndVods.vods as vod}
        <a href={`/community/${data.communityCreatorAndVods.slug}/${vod.slug}`}>{vod.service}-{vod.videoTitle}</a>
    {/each}
</div>