<script lang="ts">
    import Fa from "svelte-fa";
    import type { IconDefinition } from "@fortawesome/free-brands-svg-icons";

    export let href: string;
    export let icon: IconDefinition;
    export let provider: "Twitch" | "Google"
</script>

<a {href} class={`btn btn-neutral w-60 rounded-full shadow-lg mx-auto flex flex-row`}>
    <div class={"text-xl"}>
        <Fa class={"my-auto"} {icon} />
    </div>
    <div class={"my-auto"}>
        Log in with {provider}
    </div>
</a>