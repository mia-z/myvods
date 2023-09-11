<script lang="ts">
    import { faGoogle, faTwitch } from "@fortawesome/free-brands-svg-icons";
    import LoginButton from "$components/LoginButton.svelte";
	import { GoogleOAuthUrlHref, TwitchOAuthUrlHref } from "$lib/AuthUrlHelper";
</script>

<div class={"flex flex-col w-72 mx-auto rounded-2xl shadow-lg my-auto bg-base-300 py-5 gap-y-5"}>
    <a href={"/creators-login"} class={""}></a>
</div>
