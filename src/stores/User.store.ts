import axios from "axios";
import { writable } from "svelte/store";
import * as Cookies from "es-cookie";
import type { Prisma } from "@prisma/client";

type UserFromUuid = Prisma.UserGetPayload<{
    include: {
        oauthConnections: true
    }
}>;

type UserState = UserFromUuid;

const createStore = () => {
	const { subscribe, set } = writable<UserState>();

	return {
		subscribe,
        init: async () => {
            const uuidToken = Cookies.get("user");
            const userFromUuidToken = await axios.get<UserFromUuid>(`/api/loginToken/${uuidToken}/user`, {
                validateStatus: () => true
            });
            
            if (userFromUuidToken.status !== 200) {
                throw new Error("Didnt get 200 when getting user from uuid");
            }
            console.log(userFromUuidToken.data)
            set(userFromUuidToken.data);
        }
	};
}

export const UserData = createStore();