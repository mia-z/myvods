<script lang="ts">
	import { superForm } from "sveltekit-superforms/client";
	import type { PageData } from "./$types";
	import Fa from "svelte-fa";
	import { faChevronUp, faSpinner } from "@fortawesome/free-solid-svg-icons";
	import { onMount } from "svelte";
	import { Duration } from "luxon";
	import { slide } from "svelte/transition";

    export let data: PageData;
    export let currentVodTime: number;

    const { form, errors, enhance, submitting, message } = superForm(data.newAnnotationForm);

    let formOpen: boolean = false;

    onMount(() => {
        $form.communityVodId = data.communityVodWithAnnotations.id;
    });

    const onGetCurrentTimeClick = () => {
        const isoTime = Duration.fromObject({ seconds: currentVodTime }).shiftTo("hours", "minutes", "seconds").toObject();
        console.log(isoTime);
        if (isoTime.hours) {
            $form.hour = isoTime.hours;
        }
        if (isoTime.minutes) {
            $form.minute = isoTime.minutes;
        }
        if (isoTime.seconds) {
            $form.second = Math.trunc(isoTime.seconds);
        }
    }
</script>

{#if formOpen}
<form method="POST" action="?/newannotation" use:enhance transition:slide={{ axis: "y" }} class={"flex flex-row flex-wrap gap-x-5 p-5 bg-base-300 shadow-lg rounded-b-2xl"}>
    <div class={"w-full text-center text-2xl"}>
        New Annotation
    </div>
    <div class={"form-control flex-row space-x-5"}>
        <button disabled={$submitting} type={"button"} on:click={onGetCurrentTimeClick} class={"btn btn-secondary mt-auto w-1/2"}>
            Insert Current VOD Time
        </button>
        <div class={"flex-1"}>
            <label for={"newannotation-hour"} class={"label"}>
                <span class={"label-text mx-auto"}>Hour</span>
            </label>
            <input disabled={$submitting} type="number" max={23} min={0} id={"newannotation-hour"} name={"hour"} bind:value={$form.hour} class={"input input-bordered w-full text-center"} />
        </div>
        <div class={"flex-1"}>
            <label for={"newannotation-minute"} class={"label"}>
                <span class={"label-text mx-auto"}>Minute</span>
            </label>
            <input disabled={$submitting} type="number" max={59} min={0} id={"newannotation-minute"} name={"minute"} bind:value={$form.minute} class={"input input-bordered w-full text-center"} />
        </div>
        <div class={"flex-1"}>
            <label for={"newannotation-second"} class={"label"}>
                <span class={"label-text mx-auto"}>Second</span>
            </label>
            <input disabled={$submitting} type="number" max={59} min={0} id={"newannotation-second"} name={"second"} bind:value={$form.second} class={"input input-bordered w-full text-center"} />
        </div>
    </div>
    <div class={"form-control flex-1"}>
        <label for={"newannotation-game"} class={"label"}>
            <span class={"label-text mx-auto"}>Game</span>
        </label>
        <input disabled={$submitting} type="text" id={"newannotation-game"} name={"game"} bind:value={$form.game} class={"input input-bordered w-full"} />
    </div>
    <div class={"form-control flex-1"}>
        <label for={"newannotation-subject"} class={"label"}>
            <span class={"label-text mx-auto"}>Subject</span>
        </label>
        <input disabled={$submitting} type="text" id={"newannotation-subject"} name={"subject"} bind:value={$form.subject} class={"input input-bordered w-full"} />
    </div>
    <div class={"form-control w-full"}>
        <label for={"newannotation-note"} class={"label"}>
            <span class={"label-text mx-auto"}>Note</span>
        </label>
        <input disabled={$submitting} type="text" id={"newannotation-note"} name={"note"} bind:value={$form.note} class={"input input-bordered"} />
    </div>
    {#if $errors._errors}
        <div class={"text-sm text-error italic text-center"}>
            {$errors._errors.join(", ")}
        </div>
    {/if}
    {#if $message}
        <div class={"text-sm text-success mx-auto italic mt-1"}>
            {$message}
        </div>
    {/if}
    <div class={"form-control hidden"}>
        <input name={"communityVodId"} type="number" bind:value={$form.communityVodId} />
    </div>
    <div class={"form-control w-full"}>
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
{/if}

<div class={"swap w-full mx-auto"}>
    <input type="checkbox" bind:checked={formOpen} />
    <div class={"swap-on mx-auto"}>
        <button class={"btn btn-neutral mt-2 rounded-full mx-auto"} on:click={() => formOpen = !formOpen}>
            <Fa icon={faChevronUp} />
        </button>
    </div>
    <div class={"swap-off"}>
        <button class={"btn btn-neutral mt-2 w-fit rounded-full mx-auto"} on:click={() => formOpen = !formOpen}>
            New Annotation
        </button>
    </div>
</div>