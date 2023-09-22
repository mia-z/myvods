<script lang="ts">
	import Fa from "svelte-fa";
    import { faSave, faX } from "@fortawesome/free-solid-svg-icons";
	import { superForm } from "sveltekit-superforms/client";
	import type { CommunityCreator } from "@prisma/client";
	import { onMount } from "svelte";

    export let editCreatorForm;
    export let editingId: number;
    export let creator: CommunityCreator;

    const { form, errors, enhance, submitting, message } = superForm(editCreatorForm, {
        onResult(event) {
            if (event.result.type === "success") {
                editingId = -1;
            }
        },
        onError(event) {
            console.log("");
            console.log(event);
        },
    });

    onMount(() => {
        $form.id = creator.id;
        $form.name = creator.name;
        $form.description = creator.description;
        $form.imageLink = creator.imageLink;
    });
</script>

<form class={"grid grid-flow-row grid-cols-12 gap-x-6"} action={"?/editcreator"} method="POST" use:enhance>
    <div class={"col-span-1"}>
        <input readonly name={"id"} class={"input input-sm text-center w-full"} bind:value={$form.id} />
    </div>
    <div class={"col-span-2 flex flex-col"}>
        <input disabled={$submitting} name={"name"} class={"input input-sm w-full"} bind:value={$form.name} />
    </div>
    <div class={"col-span-5 flex flex-col"}>
        <input disabled={$submitting} name={"description"} class={"input input-sm w-full"} bind:value={$form.description} />
    </div>
    <div class={"col-span-3 flex flex-col"}>
        <input disabled={$submitting} name={"imageLink"} class={"input input-sm w-full"} bind:value={$form.imageLink} />
    </div>
    <div class={"col-span-1 flex flex-row gap-x-3"}>
        <button disabled={$submitting} type={"submit"}>
            <Fa class={"m-auto hover:text-success hover:cursor-pointer"} icon={faSave} />
        </button>
        <button type={"button"} on:click={() => editingId = -1}>
            <Fa class={"m-auto hover:text-error hover:cursor-pointer"} icon={faX} />
        </button>
    </div>
    {#if $errors._errors}
        <div class={"col-span-12 text-center text-italic text-sm text-error"}>
            {$errors._errors?.join(", ")}
        </div>
    {/if}
    {#if $message}
        <div class={"col-span-12 text-success text-center mx-auto text-sm italic"}>
            {$message}
        </div>
    {/if}
</form>