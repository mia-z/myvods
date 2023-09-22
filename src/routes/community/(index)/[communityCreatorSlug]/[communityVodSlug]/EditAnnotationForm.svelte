<script lang="ts">
	import type { CommunityVodAnnotation } from "@prisma/client";
	import type { PageData } from "./$types";
	import { superForm } from "sveltekit-superforms/client";
	import { faPenToSquare, faSave, faX } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";
	import { Duration } from "luxon";
	import { onMount } from "svelte";

    export let data: PageData;
    export let annotation: CommunityVodAnnotation;
    export let editingAnnotationId: number;

    const { form, errors, enhance, submitting, message } = superForm(data.editAnnotationForm);

    onMount(() => {
        $form.annotationId = annotation.id;
        $form.game = annotation.game || "None";
        $form.subject = annotation.subject || "Memes";
        $form.note = annotation.note || "";

        const timeObject = Duration.fromMillis(annotation.timestamp).shiftTo("hours", "minutes", "seconds").toObject();
        $form.hour = timeObject.hours || 0;
        $form.minute = timeObject.minutes || 0;
        $form.second = timeObject.seconds || 0;
    });
    //add hidden value elements
</script>

<form method="POST" action="?/editannotation" use:enhance>
    <div class={"flex flex-row flex-wrap bg-base-300 p-2 gap-2 rounded-xl"}>
        <div class={"w-full flex flex-row pr-2"}>
            <div class={"w-2/3 bg-base-200 rounded-xl text-sm p-1 pl-2 grid grid-cols-4 pb-3 pr-2 gap-x-3"}>
                <div class={"my-auto text-white font-bold"}>
                    Timestamp
                </div>
                <div class={"flex flex-col"}>
                    <label for={"editannotation-hour"} class={"label mx-auto"}>
                        Hour
                    </label>
                    <input disabled={$submitting} bind:value={$form.hour} type="number" min={0} max={23} id={"editannotation-hour"} name={"hour"} class={"input input-bordered input-sm text-center"} />
                </div>
                <div class={"flex flex-col"}>
                    <label for={"editannotation-minute"} class={"label mx-auto"}>
                        Minute
                    </label>
                    <input disabled={$submitting} bind:value={$form.minute} type="number" min={0} max={59} id={"editannotation-minute"} name={"minute"} class={"input input-bordered input-sm text-center"} />
                </div>
                <div class={"flex flex-col"}>
                    <label for={"editannotation-second"} class={"label mx-auto"}>
                        Second
                    </label>
                    <input disabled={$submitting} bind:value={$form.second} type="number" min={0} max={59} id={"editannotation-second"} name={"second"} class={"input input-bordered input-sm text-center"} />
                </div>
            </div>
            <button disabled={$submitting} type={"submit"} class={"btn btn-neutral btn-sm ml-auto hover:text-success active:text-green-300 hover:cursor-pointer"}>
                <div class={"select-none text-sm text-white mr-2 my-auto"}>
                    Save
                </div>
                <Fa class={"text-xl"} icon={faSave} />
            </button>
            <button on:click={() => editingAnnotationId = -1} disabled={$submitting} type={"button"} class={"btn btn-neutral btn-sm ml-auto hover:text-danger active:text-red-300 hover:cursor-pointer"}>
                <Fa class={"text-xl"} icon={faX} />
            </button>
        </div>
        <div class={"flex-1 flex flex-col"}>
            <label for={"editannotation-game"} class={"label-text font-bold pt-1 text-white bg-base-200 rounded-t-xl w-fit px-5 rounded-b-none"}>
                Game
            </label>
            <input disabled={$submitting} name={"game"} id={"editannotation-game"} class={"input input-bordered input-sm rounded-tl-none"} bind:value={$form.game} />
        </div>
        <div class={"flex-1 flex flex-col"}>
            <label for={"editannotation-subject"} class={"label-text font-bold pt-1 text-white bg-base-200 rounded-t-xl w-fit px-5 rounded-b-none"}>
                Subject
            </label>
            <input disabled={$submitting} name={"subject"} id={"editannotation-subject"} class={"input input-bordered input-sm rounded-tl-none"} bind:value={$form.subject} />
        </div>
        <div class={"w-full flex flex-col"}>
            <label for={"editannotation-note"} class={"label-text font-bold pt-1 text-white bg-base-200 rounded-t-xl w-fit px-5 rounded-b-none"}>
                Note
            </label>
            <input disabled={$submitting} name={"note"} id={"editannotation-note"} class={"input input-bordered input-sm rounded-tl-none"} bind:value={$form.note} />
        </div>
        <input disabled={$submitting} name={"annotationId"} class={"hidden"} bind:value={$form.annotationId} />
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
    </div>
</form>