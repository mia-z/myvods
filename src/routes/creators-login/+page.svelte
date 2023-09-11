<script lang="ts">
    import { faGoogle, faTwitch } from "@fortawesome/free-brands-svg-icons";
    import LoginButton from "$components/LoginButton.svelte";
	import { GoogleOAuthUrlHref, TwitchOAuthUrlHref } from "$lib/AuthUrlHelper";
</script>

<div class={"flex flex-col w-72 mx-auto rounded-[2.5rem] shadow-lg my-auto bg-base-300 py-5 gap-y-5"}>
    <div class={"select-none font-lobster text-2xl font-bold text-center"}>
        Omni<span class={"text-indigo-400"}>Vods</span>
    </div>
    <LoginButton href={GoogleOAuthUrlHref} icon={faGoogle} provider={"Google"} />
    <LoginButton href={TwitchOAuthUrlHref} icon={faTwitch} provider={"Twitch"} />
</div>
