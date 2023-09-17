<svelte:head>
    <script async={false} src={"https://www.youtube.com/iframe_api"}></script>
</svelte:head>

<script lang="ts">
	import { onMount } from "svelte";

    export let duration: number;
    export let currentTime: number;
    export let videoId: string;
    export const seek = async (seek: number) => {
        await player.seekTo(seek, false);
    }
    
    let player: YT.Player;

    onMount(async () => {
        try {
            player = new YT.Player("youtube-player", {
                videoId: videoId,
                height: "100%",
                width: "100%"
            });
        } catch (e) {
            //This is a pretty dirty fix that should be made more robust in the future
            setTimeout(() => {
                player = new YT.Player("youtube-player", {
                    videoId: videoId,
                    height: "100%",
                    width: "100%"
                });
            }, 500);
        }
    }); 
</script>

<div id={"youtube-player"} />