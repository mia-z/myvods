<script lang="ts">
	import { superForm } from "sveltekit-superforms/client";
	import type { PageData } from "./$types";
	import Fa from "svelte-fa";
	import { faSpinner } from "@fortawesome/free-solid-svg-icons";
	import { onMount } from "svelte";

    export let data: PageData;

    const { form, errors, enhance, submitting, message } = superForm(data.newVodForm);

    onMount(() => {
        $form.communityCreatorId = data.communityCreatorAndVods.id;
    });
</script>

<form method="POST" action="?/newvod" use:enhance class={"flex flex-col"}>
    <div class={"form-control flex-row space-x-2"}>
        <div class:bg-neutral-focus={$form.service === "Youtube"} class={"flex flex-col flex-1 rounded-2xl hover:bg-neutral-focus"}>
            <label for={"check-youtube"} class={"label w-full text-center"}>
                <span class={"label-text w-full"}>YouTube</span>
            </label>
            <input id={"check-youtube"} name={"service"} type="radio" bind:group={$form.service} value={"Youtube"} checked />
        </div>
        <div class:bg-neutral-focus={$form.service === "Twitch"} class={"flex flex-col flex-1 rounded-2xl hover:bg-neutral-focus hover:cursor-not-allowed"}>
            <label for={"check-twitch"} class={"label w-full text-center"}>
                <span class={"label-text w-full"}>Twitch</span>
            </label>
            <div class={"tooltip tooltip-info"} data-tip={"Twitch coming soon"} >
                <input disabled id={"check-twitch"} name={"service"} type="radio" bind:group={$form.service} value={"Twitch"} />
            </div>
        </div>
        <div class:bg-neutral-focus={$form.service === "Kick"} class={"flex flex-col flex-1 rounded-2xl hover:bg-neutral-focus hover:cursor-not-allowed"}>
            <label for={"check-kick"} class={"label w-full text-center"}>
                <span class={"label-text w-full"}>Kick</span>
            </label>
            <div class={"tooltip tooltip-info"} data-tip={"Kick coming soon"} >
                <input disabled id={"check-kick"} name={"service"} type="radio" bind:group={$form.service} value={"Kick"} />
            </div>
        </div>
    </div>
    <div class={"form-control"}>
        <label for={"videoId"} class={"label"}>
            <span class={"label-text"}>Video ID or URL</span>
            {#if $errors.videoId}
                <span class={"label-text-alt ml-auto text-error italic"}>
                    {$errors.videoId}
                </span>
            {/if}
            <span class={"label-text-alt"}></span>
        </label>
        <input type="text" name={"videoId"} bind:value={$form.videoId} class={"input input-bordered"} />
    </div>
    {#if $errors._errors}
        <div class={"text-sm text-error italic text-center"}>
            {$errors._errors.join(", ")}
        </div>
    {/if}
    {#if $message}
        <div class={"text-sm text-success italic text-center"}>
            {$message}
        </div>
    {/if}
    <div class={"form-control hidden"}>
        <input name={"communityCreatorId"} type="number" bind:value={$form.communityCreatorId} />
    </div>
    <div class={"form-control"}>
        <button disabled={$submitting} type={"submit"} class={"swap btn btn-block btn-primary mt-5"}>
            <input bind:checked={$submitting} type="checkbox" />
            <div class={"swap-on"}>
                <Fa icon={faSpinner} class={"animate-spin text-4xl"} />
            </div>
            <div class={"swap-off"}>
                Save
            </div>
        </button>
    </div>
</form>