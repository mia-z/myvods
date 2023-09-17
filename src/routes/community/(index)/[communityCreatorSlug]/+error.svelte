<script lang="ts">
    import { page } from "$app/stores";
	import { error } from "@sveltejs/kit";

    if ($page.status !== 404) {
        throw error(500, $page?.error ?? "Probably a very bad error!")
    }
</script>

<h1>{$page.status}: {$page?.error?.message}</h1>
should probably make this look prettier at some point