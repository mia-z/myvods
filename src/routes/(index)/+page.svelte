<script lang="ts">
    import axios from "axios";
    import Fa from "svelte-fa";
    import { faGoogle } from "@fortawesome/free-brands-svg-icons";
	import GoogleLoginButton from "$components/GoogleLoginButton.svelte";
	import TwitchLoginButton from "$components/TwitchLoginButton.svelte";
</script>

<div class={"flex flex-col w-72 mx-auto rounded-md shadow-lg my-auto bg-base-300 py-5 gap-y-5"}>
    <div class={"lobster text-2xl font-bold text-center"}>
        My<span class={"text-indigo-400"}>Vods</span>
    </div>
    <GoogleLoginButton />
    <TwitchLoginButton />
    
</div>
