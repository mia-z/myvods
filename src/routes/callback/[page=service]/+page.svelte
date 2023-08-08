<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import * as Cookies from "es-cookie";

    onMount(() => {
        const service = $page.params.page;
        const code = $page.url.searchParams.get("code");
        if (code) {
            Cookies.set(`${service}_code`, code);
            goto("/app");
        } else {
            throw Error(`Couldnt get code from ${service} oauth`);
        }
    });
</script>

<div>
    redirecting
</div>