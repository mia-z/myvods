<svelte:head>
    <script async={false} src={"https://www.youtube.com/iframe_api"}></script>
</svelte:head>

<script lang="ts">
	import { onMount } from "svelte";
    import { player } from "$stores/Player.store";

    export let duration: number;
    export let currentTime: number;
    export let videoId: string;

    export const seek = async (seek: number) => {
        await $player.playVideo();
        await $player.seekTo(seek, true);
    }
    
    let playerState: YT.PlayerState = 0;
    let playerInterval: ReturnType<typeof setInterval>;

    const onPlayerStateChange = (event: CustomEvent & { data: YT.PlayerState }) => {
        playerState = event.data;
    }

    $: if (playerState === 1) {
        console.log("playing");
        playerInterval = setInterval(() => {
            //@ts-ignore
            currentTime = $player.getCurrentTime();
        }, 1000);
    } else {
        clearInterval(playerInterval);
        console.log("not playing");
    }

    const onPlayerReady = (e: CustomEvent) => {
        console.log("ready");
        console.log(e);
    }

    const constructPlayer = (videoId: string) => {
        const p = new YT.Player("youtube-player", {
            videoId: videoId,
            height: "100%",
            width: "100%",
            events: {
                //@ts-ignore - idk why this one is complaining
                onStateChange: onPlayerStateChange,
                onReady: onPlayerReady
            }
        });
        return p;
    }

    onMount(async () => {
        try {
            player.init(constructPlayer(videoId));
        } catch (e) {
            //This is a pretty dirty fix that should be made more robust in the future
            setTimeout(() => {
                player.init(constructPlayer(videoId));
            }, 500);
        }
    }); 
</script>

<div id={"youtube-player"} />