import { writable } from "svelte/store";

const createPlayer = () => {
	const { subscribe, set, update } = writable<YT.Player>();

	return {
		subscribe,
		init: (player: YT.Player) => set(player) 
	};
}

export const player = createPlayer();