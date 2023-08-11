import { PUBLIC_GOOGLE_CLIENT_ID, PUBLIC_GOOGLE_AUTH_CALLBACK_URI, PUBLIC_TWITCH_CLIENT_ID, PUBLIC_TWITCH_AUTH_CALLBACK_URI } from "$env/static/public";

const GoogleOAuthUrl = (): URL => {
    const scopes = [
        "https://www.googleapis.com/auth/youtube.readonly",
        "https://www.googleapis.com/auth/userinfo.profile"
    ];

    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.append("scope", scopes.join(" "));
    url.searchParams.append("access_type", "offline");
    url.searchParams.append("include_granted_scopes", "true");
    url.searchParams.append("response_type", "code");
    url.searchParams.append("redirect_uri", PUBLIC_GOOGLE_AUTH_CALLBACK_URI);
    url.searchParams.append("client_id", PUBLIC_GOOGLE_CLIENT_ID);
    return url;
}

const GoogleOAuthUrlHref = GoogleOAuthUrl().href;

const TwitchOAuthUrl = (): URL => {
    const scopes = [
        ""
    ];

    const url = new URL("https://id.twitch.tv/oauth2/authorize");
    url.searchParams.append("scope", scopes.join(" "));
    url.searchParams.append("response_type", "code");
    url.searchParams.append("redirect_uri", PUBLIC_TWITCH_AUTH_CALLBACK_URI);
    url.searchParams.append("client_id", PUBLIC_TWITCH_CLIENT_ID);

    return url;
}

const TwitchOAuthUrlHref = TwitchOAuthUrl().href;

export {
    GoogleOAuthUrl,
    GoogleOAuthUrlHref,
    TwitchOAuthUrl,
    TwitchOAuthUrlHref
}