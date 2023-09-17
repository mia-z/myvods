<script lang="ts">
	import { fade, slide, fly } from "svelte/transition";
    import { cubicInOut } from "svelte/easing";

    export let open: boolean;
    export let side: "left" | "right" = "left";
    export let width: "w-96" | "w-144" = "w-96"; //tailwind-css width string (w-[x])
    const widthToPixels = width === "w-96" ? "386" : "576";
</script>

{#if open}
<div class={"absolute w-screen h-screen top-0 left-0 overflow-x-hidden"}>
    <div transition:fade role={"button"} on:click={() => open = !open} class={"sidebar-overlay z-10 absolute top-0 left-0 h-full w-full bg-[rgba(12,12,12,0.2)] backdrop-blur-sm"}>
        <!-- Overlay -->
    </div>
    <div transition:fly={{ x: side === "left" ? `-${widthToPixels}px` : `${widthToPixels}px`, opacity: 100, easing: cubicInOut, duration: 200 }} class={`sidebar-content relative z-20 top-0 bg-base-200 h-full ${width} ${side === "left" ? "left-0" : "left-[calc(100vw-384px)]"} ${(width === "w-144" && side === "right") ? "left-[calc(100vw-576px)]" : ""}`}>
        <slot />
    </div>
</div>
{/if}