export const Providers = [ "Twitch", "Google" ] as const;

export type Provider = typeof Providers[number];