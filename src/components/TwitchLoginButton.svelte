<script lang="ts">
    import Fa from "svelte-fa";
    import { faTwitch } from "@fortawesome/free-brands-svg-icons";
    import { PUBLIC_TWITCH_CLIENT_ID, PUBLIC_TWITCH_AUTH_CALLBACK_URI } from "$env/static/public";

    const scopes = [
        ""
    ];

    const url = new URL("https://id.twitch.tv/oauth2/authorize");
    url.searchParams.append("scope", scopes.join(" "));
    url.searchParams.append("response_type", "code");
    url.searchParams.append("redirect_uri", PUBLIC_TWITCH_AUTH_CALLBACK_URI);
    url.searchParams.append("client_id", PUBLIC_TWITCH_CLIENT_ID);

    const href = url.href;
</script>

<a {href} class={`btn btn-neutral w-60 rounded-full shadow-lg mx-auto flex flex-row`}>
    <div class={"text-xl"}>
        <Fa class={"my-auto"} icon={faTwitch} />
    </div>
    <div class={"my-auto"}>
        Log in with Twitch
    </div>
</a>