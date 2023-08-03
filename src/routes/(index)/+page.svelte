<script lang="ts">
    import { GoogleOAuthUrl } from "$lib/AuthUrlHelper";
    import axios from "axios";

</script>

{#await axios.get("/api/google/auth")}
    <div>
        Loading google auth url
    </div>
{:then res} 
    <a href={res.data}>
        Log in via google
    </a>
{/await}