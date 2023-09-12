<script lang="ts">
	import type { PageServerData } from "./$types";

    export let data: PageServerData;
</script>

<div>
    {#each data.communityCreators as creator}
        <a href={`/community/${creator.slug}`} class={"btn btn-neutral rounded-full "}>{creator.name}</a>
    {/each}
</div>