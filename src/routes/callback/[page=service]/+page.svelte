<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import * as Cookies from "es-cookie";
	import axios from "axios";
	import { PUBLIC_GOOGLE_API_KEY } from "$env/static/public";
    import { v4 as uuid } from "uuid";

    onMount(async () => {
        const service = $page.params.page;
        const code = $page.url.searchParams.get("code");
        
        if (!code) {
            throw new Error("OAuth provider didnt return a code!");
        }

        switch (service) {
            case "google": await initGoogleAuth(code); break;
            case "twitch": throw new Error("Unimplemented error");
            default: throw new Error("Unsupported OAuth provider (This shouldnt ever happen lol)");
        }
    });

    const initGoogleAuth = async (code: string) => {
        const tokenRes = await axios.get<YoutubeTokenRes>(`/api/google/auth/token?code=${code}`);

        const googleUserRes = await axios.get<Google.Person>(`https://people.googleapis.com/v1/people/me?personFields=names&key=${PUBLIC_GOOGLE_API_KEY}`, {
            headers: {
                "Authorization": `Bearer ${tokenRes.data.access_token}`,
                "Accept": "application/json"
            }
        });
        
        const googleUser = googleUserRes.data.names.find(x => x.metadata.source.type === "PROFILE");

        if (!googleUser) {
            console.log("Couldnt get user from fetched People API data checking for PROFILE");
            return;
        }

        const internalUserRes = await axios.get("/api/user/hasprovider/google/" + googleUser?.metadata.source.id, {
            validateStatus: () => true
        });

        if (!!!internalUserRes.data) {
            const createUserRes = await axios.post("/api/user", JSON.stringify({
                displayName: googleUser.displayName,
                accountId: googleUser.metadata.source.id,
                provider: "GOOGLE",
                authCode: code,
                refreshToken: tokenRes.data.refresh_token
            }), {
                validateStatus: () => true
            });

            console.log(createUserRes.data);
        } else {

        }
    }
</script>

<div>
    redirecting
</div>
