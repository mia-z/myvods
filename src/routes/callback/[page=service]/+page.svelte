<script lang="ts">
	import { onMount } from "svelte";
    import { page } from "$app/stores";
	import { setupGoogleAuth } from "$lib/GoogleAuthHelper";
	import { setupTwitchAuth } from "$lib/TwitchAuthHelper";


    onMount(async () => {
        const service = $page.params.page;
        const code = $page.url.searchParams.get("code");
        
        if (!code) {
            throw new Error("OAuth provider didnt return a code!");
        }

        switch (service) {
            case "google": await setupGoogleAuth(code); break;
            case "twitch": await setupTwitchAuth(code); break;
            default: throw new Error("Unsupported OAuth provider (This shouldnt ever happen lol)");
        }
    });

</script>

<div>
    redirecting
</div>
