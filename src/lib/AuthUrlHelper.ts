import { PUBLIC_YOUTUBE_CLIENT_ID, PUBLIC_YOUTUBE_AUTH_CALLBACK_URI } from "$env/static/public";

const GoogleOAuthUrl = (): URL => {
    const loginUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    loginUrl.searchParams.append("client_id", PUBLIC_YOUTUBE_CLIENT_ID);
    loginUrl.searchParams.append("redirect_uri", PUBLIC_YOUTUBE_AUTH_CALLBACK_URI);
    loginUrl.searchParams.append("response_type", "token");
    loginUrl.searchParams.append("scope", "https://www.googleapis.com/auth/youtube.readonly");

    return loginUrl;
}

export {
    GoogleOAuthUrl
}