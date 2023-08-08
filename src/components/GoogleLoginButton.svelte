<script lang="ts">
    import Fa from "svelte-fa";
    import { faGoogle } from "@fortawesome/free-brands-svg-icons";
    import { PUBLIC_GOOGLE_CLIENT_ID, PUBLIC_GOOGLE_AUTH_CALLBACK_URI } from "$env/static/public";

    const scopes = [
        "https://www.googleapis.com/auth/youtube.readonly"
    ];

    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.append("scope", scopes.join(","));
    url.searchParams.append("access_type", "offline");
    url.searchParams.append("include_granted_scopes", "true");
    url.searchParams.append("response_type", "code");
    url.searchParams.append("redirect_uri", PUBLIC_GOOGLE_AUTH_CALLBACK_URI);
    url.searchParams.append("client_id", PUBLIC_GOOGLE_CLIENT_ID);

    const href = url.href;
</script>

<a {href} class={`btn btn-neutral w-60 rounded-full shadow-lg mx-auto flex flex-row`}>
    <div class={"text-xl"}>
        <Fa class={"my-auto"} icon={faGoogle} />
    </div>
    <div class={"my-auto"}>
        Log in with Google
    </div>
</a>