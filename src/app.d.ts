import type { $Enums } from "@prisma/client";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			communityContributorId?: number;
			communityContributorNick?: string;
		}
		// interface PageData {}
		// interface Platform {}
	}

	type User = {
		displayName: string,
		id: number,
		oauthConnections: {
			[key in $Enums.Provider]?: OAuthConnection
		},
		vods: Vod[]
	}
	
	type OAuthConnection = {
		id: number ,
		accountId: string,
		authCode: string,
		refreshToken: string,
		provider: $Enums.Provider
	}
	
	type Vod = {
		id: number,
		provider: $Enums.Provider,
		link: string
	}
}
