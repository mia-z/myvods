<script lang="ts">
	import { onMount } from "svelte";

    export let videoId: string;

    onMount(() => {
        const constructPlayer = (embedElement: string, opts: Twitch.IPlayerOptions) => {
            if (!opts.channel && !opts.collection && !opts.video) {
                    throw new Error("At least one of IPlayerOptions 'player', 'channel' or 'video' must be provided");
            } else {
                return new Twitch.Player(embedElement, opts);
            }
        }

        const player = constructPlayer("player", {
            height: 400,
            width: 400,
            parent: [ "" ],
            video: videoId
        });
    });


</script>

<svelte:head>
    <script src="https://player.twitch.tv/js/embed/v1.js"></script>
</svelte:head>

<div>
    <div id={"player"} />
</div>