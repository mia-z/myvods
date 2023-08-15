<script lang="ts">
	import { faCog } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";
</script>

<div class={"container md:w-144 my-5 p-5 mx-auto bg-base-300 rounded-xl shadow-lg flex flex-col relative"}>
    <div class={"absolute w-full h-1.5 bg-indigo-500 top-0 left-0 rounded-t-xl"}>
        <div class={"relative top-0 left-0 w-6 h-6 bg-indigo-500 rounded-tl-md rounded-br-md"}>
            <Fa size={"sm"} icon={faCog} class={"absolute top-1 left-1 "} />
        </div>
    </div>
    <div class={"text-center font-roboto font-bold text-2xl"}>
        Profile Settings
    </div>
</div>