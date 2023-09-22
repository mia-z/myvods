<script lang="ts">
	import { faSpinner } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";
	import { slide } from "svelte/transition";
	import { superForm } from "sveltekit-superforms/client";

    export let newCreatorForm;

    const { form, errors, enhance, submitting, message } = superForm(newCreatorForm);
</script>

<form class={"flex gap-x-2 flex-row flex-wrap"} action={"?/newcreator"} method="POST" use:enhance>
    <div class={"form-control flex-1"}>
        <label for={"name"} class={"label"}>
            <span class={"label-text"}>Creator Name</span>
            {#if $errors.name}
                <span class={"label-text-alt text-error"}>{$errors.name}</span>
            {/if}
        </label>
        <input disabled={$submitting} aria-invalid={$errors.name ? "true" : undefined} bind:value={$form.name} name={"name"} class={"input input-bordered"} />
    </div>
    <div class={"form-control flex-1"}>
        <label for={"description"} class={"label"}>
            <span class={"label-text"}>Creator Description</span>
        </label>
        <input disabled={$submitting} bind:value={$form.description} name={"description"} class={"input input-bordered"} />
    </div>
    <div class={"form-control w-full"}>
        <label for={"imageLink"} class={"label"}>
            <span class={"label-text"}>Creator Image URL</span>
            <span class="label-text-alt">Leave default if there's no image at this time</span>
        </label>
        <input disabled={$submitting} bind:value={$form.imageLink} name={"imageLink"} class={"input input-bordered"} />
    </div>
    <button disabled={$submitting} type={"submit"} class={"swap btn btn-block btn-primary mt-5"}>
        <input bind:checked={$submitting} type="checkbox" />
        <div class={"swap-on"}>
            <Fa icon={faSpinner} class={"animate-spin mx-auto text-4xl"} />
        </div>
        <div class={"swap-off"}>
            Save
        </div>
    </button>
    {#if $message}
        <div transition:slide class={"mt-2 text-success text-center mx-auto text-sm italic"}>
            {$message}
        </div>
    {/if}
</form>