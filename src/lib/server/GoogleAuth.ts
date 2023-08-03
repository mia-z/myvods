import { SECRET_YOUTUBE_CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_YOUTUBE_AUTH_CALLBACK_URI, PUBLIC_YOUTUBE_CLIENT_ID } from "$env/static/public";
import { google } from "googleapis";

const oauth = new google.auth.OAuth2(PUBLIC_YOUTUBE_CLIENT_ID, SECRET_YOUTUBE_CLIENT_SECRET, PUBLIC_YOUTUBE_AUTH_CALLBACK_URI);

export default oauth;
export {
    oauth as GoogleOAuth2
}