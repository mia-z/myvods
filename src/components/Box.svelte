<script lang="ts">
	import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";

    export let icon: IconDefinition;

</script>

<svelte:element this={$$props.as} class={"container md:w-144 my-5 p-5 mx-auto bg-base-300 rounded-xl shadow-lg flex flex-col relative " + $$props.class}>
    <div class={"absolute w-full h-1.5 bg-indigo-500 top-0 left-0 rounded-t-xl"}>
        <div class={"relative top-0 left-0 w-6 h-6 bg-indigo-500 rounded-tl-md rounded-br-md"}>
            <Fa size={"sm"} {icon} class={"absolute top-1 left-1 "} />
        </div>
    </div>
    <slot/>
</svelte:element>