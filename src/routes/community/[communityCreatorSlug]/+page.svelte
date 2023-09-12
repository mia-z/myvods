<script lang="ts">
    import { page } from "$app/stores";
	import { onMount } from "svelte";
	import type { PageServerData } from "./$types";
	import { trpc } from "$trpc/client";
    
    export let data: PageServerData;

    onMount(async () => {
        //const res = trpc($page).contributor.createCommunityVod.mutate({
        //    service: "Youtube",
        //    video: "Ks-_Mh1QhMc",
        //    communityCreatorId: 1
        //});
    });
</script>

<div>
    
</div>