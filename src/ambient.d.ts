type OAuthTokenPayload = {
    access_token: string,
    expires_in: number,
    token_type: "Bearer" | "bearer",
    scope?: string | string[] | null,
    refresh_token?: string
}

type TwitchTokenRes = {
    access_token: string,
    expires_in: number,
    token_type: "bearer",
    scope?: string[],
    refresh_token: string
}

type TwitchTokenUser = {
    client_id: string,
    login: string,
    scopes?: string[] | null | undefined,
    user_id: string,
    expires_in: number
}