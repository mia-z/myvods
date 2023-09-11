<script lang="ts">
	import { UserData } from "$stores/User.store";
	import { trpc } from "$trpc/client";
    import { faEdit, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";
	import { fade } from "svelte/transition";

    let isChangingName: boolean = false;
    let nameInputText = $UserData.displayName;
    let nameInput: HTMLInputElement;

    let savingNameChange: boolean = false;

    let nameChangeErrors: TrpcValidationError[] = [];

    const onEditChecked = (event: Event & { currentTarget: EventTarget & HTMLInputElement; }) => {
        if (event.currentTarget.checked) {
            nameInput.focus();
        }
    }

    const onNameInputChange = async (event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement; }) => {
        if (event.key === "Enter") {
            isChangingName = false;
            await saveNameChange();
        }

        if (event.key === "Escape") {
            isChangingName = false;
            nameChangeErrors = [];
            nameInputText = $UserData.displayName;
        }
    }

    const onNameFocusOut = () => {
        isChangingName = false;
        nameChangeErrors = [];
        nameInputText = $UserData.displayName;
    }

    const saveNameChange = async () => {
        nameChangeErrors = [];
        savingNameChange = true;
        await trpc().user.changeName.mutate(nameInputText).catch(err => {
            isChangingName = true;
            nameChangeErrors = JSON.parse(err.message);
        })
        .finally(() => {
            savingNameChange = false;
            UserData.invalidateUser().then(() => {
                nameInputText = $UserData.displayName;
            });
        });
    }
</script>

<div class={"flex flex-col"}>
    <div class={"text-center font-roboto font-bold text-xl"}>
        Account Name
    </div>
    <div class={"relative mx-auto w-2/3 rounded-full my-2"}>
        <label class={"swap absolute top-3 right-5 text-xl hover:cursor-pointer hover:scale-110 active:scale-100 transition-all"}>
            <input on:change={onEditChecked} bind:checked={isChangingName} type="checkbox" />
            <Fa class={"swap-off"} icon={faEdit} />
            <div class={"swap-on"}></div>
        </label>
        {#if savingNameChange}
            <div transition:fade class={"absolute w-full h-full flex backdrop-blur-sm rounded-full"}>
                <Fa icon={faCircleNotch} class={"animate-spin m-auto text-3xl"} />
            </div>
        {/if}
        <input 
            on:keydown={onNameInputChange}
            on:focusout={onNameFocusOut}
            bind:value={nameInputText} 
            bind:this={nameInput}
            disabled={savingNameChange}
            readonly={!isChangingName} 
            class={`bg-base-200 w-full input ${isChangingName ? "input-bordered focus:outline-indigo-500" : "input-ghost pointer-events-none text-center"} ${nameChangeErrors.length > 0 ? "input-error" : ""} rounded-full`} 
        />
        {#if nameChangeErrors.length > 0}
            <div class={"text-sm text-error text-center mt-1"}>
                {nameChangeErrors.at(0)?.code} - {nameChangeErrors.at(0)?.message}
            </div>
            
        {/if}
    </div>
    <!-- <div role={"button"} on:click={() => null} class={"text-center text-[10px] hover:cursor-pointer hover:underline"}>
        Change?
    </div> -->
</div>