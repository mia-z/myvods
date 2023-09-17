<script lang="ts">
    import Modal from "$components/Modal.svelte";
    import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
    import type { CommunityCreator } from "@prisma/client";
    import Fa from "svelte-fa";
    
    export let communityCreators: CommunityCreator[];
    
    let toolsModalOpen: boolean = true;

    const onNewCreatorSave = async () => {

    }
</script>

<button on:click={() => { toolsModalOpen = true; }} class={"absolute top-5 right-5 btn btn-neutral rounded-full"}>
    <Fa icon={faPenToSquare} />&nbsp;Community Tools
</button>

<Modal bind:open={toolsModalOpen}>
    <div slot="title">
        Community Tools - Manage Creators
    </div>
    <div slot="content">
        <div class={"flex flex-col"}>
            
        </div>
        <div class={"divider"}></div>
        <div class={"text-xl font-bold text-center text-white"}>Community Managed Creators</div>
        <div class={"flex flex-col"}>
            <table class={"table table-sm"}>
                <thead>
                    <tr>
                        <th>
                            id
                        </th>
                        <th>
                            Name
                        </th>
                        <th>
                            Description
                        </th>
                        <th>
                            Image URL
                        </th>
                        <th>
                            <!--Edit icon-->
                        </th>
                        <th>
                            <!--Delete icon-->
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {#each communityCreators as creator}
                    <tr class={"hover"}>
                        <td>
                            {creator.id}
                        </td>
                        <td>
                            {creator.name}
                        </td>
                        <td class={"truncate"}>
                            {creator.description}
                        </td>
                        <td>
                            <a class={"hover:underline hover:text-blue-400"} target={"_blank"} href={creator.imageLink}><span class={"truncate"}>{creator.imageLink}</span></a>
                        </td>
                        <td>
                            <Fa class={"hover:text-warning"} icon={faPenToSquare} />
                        </td>
                        <td>
                            <Fa class={"hover:text-error"} icon={faTrash} />
                        </td>
                    </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</Modal>