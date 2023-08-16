import { writable } from "svelte/store";
import { trpc } from "$trpc/client";
import type { Prisma } from "@prisma/client";

type User = Prisma.UserGetPayload<{
    include: {
        oauthConnections: true,
    }
}>;

const createStore = () => {
	const { subscribe, set } = writable<User>();

	return {
		subscribe,
        init: async (uuidCookie: string) => {
            const userFromUuidToken = await trpc().user.getByUUIDToken.query(uuidCookie);
            console.log(userFromUuidToken)
            set(userFromUuidToken);
        }
	};
}

export const UserData = createStore();