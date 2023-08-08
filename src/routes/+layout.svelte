<script lang="ts">
    import "$styles/base.scss";
    import { QueryClient, QueryClientProvider } from "@sveltestack/svelte-query";

    const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
    <slot />
</QueryClientProvider>