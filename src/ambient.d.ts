declare type YoutubeTokenRes = {
    access_token: string,
    expires_in: number,
    token_type: "Bearer",
    scope: string,
    refresh_token?: string
}

type TwitchTokenRes = {
    access_token: string,
    expires_in: number,
    token_type: "Bearer",
    scope: string,
    refresh_token: string
}

type TwitchValidateRes = {
    client_id: string,
    login: string,
    scopes: string[],
    user_id: string,
    expires_in: number
}

type TwitchUser = {
    login: string,
    userId: string
}