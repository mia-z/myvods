<script lang="ts">
    import "$styles/base.scss";
    import { QueryClient, QueryClientProvider } from "@sveltestack/svelte-query";
    import { SvelteToast } from "@zerodevx/svelte-toast";
	import type { SvelteToastOptions } from "@zerodevx/svelte-toast/stores";

    const queryClient = new QueryClient();

    const options: SvelteToastOptions = { 
        reversed: true, 
        intro: { 
            y: 192 
        },
    };
</script>

<QueryClientProvider client={queryClient}>
    <slot />
</QueryClientProvider>

<SvelteToast {options} />

<style lang="scss">
    :root {
        --toastContainerTop: auto;
        --toastContainerRight: auto;
        --toastContainerBottom: 8rem;
        --toastContainerLeft: calc(50vw - 8rem);
        --toastBarHeight: 0;
        --toastBorderRadius: 6px;
        --toastBtnContent: '';
        --toastBtnHeight: 0;
        --toastBtnWidth: 0;
    }
</style>