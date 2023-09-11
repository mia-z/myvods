<script lang="ts">
	import Box from "$components/Box.svelte";
    import { faCog } from "@fortawesome/free-solid-svg-icons";
	import AccountLinkOptions from "./AccountLinkOptions.svelte";
	import NameChangeOptions from "./NameChangeOptions.svelte";
</script>

<Box as={"div"} icon={faCog} >
    <div class={"text-center font-roboto font-bold text-2xl"}>
        Profile Settings
    </div>
    <div class={"divider"}></div>
    <NameChangeOptions />
    <div class={"divider"}></div>
    <AccountLinkOptions />
</Box>


