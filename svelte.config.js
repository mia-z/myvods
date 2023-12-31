//import adapter from "@sveltejs/adapter-auto";
//import adapter from "svelte-adapter-bun";
import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import("@sveltejs/kit").Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
        alias: {
            "$styles": "./src/styles/*",
            "$components": "./src/components/*",
            "$sections": "./src/sections/*",
            "$stores": "./src/stores/*",
            "$trpcroutes": "./src/lib/trpc/routes/*",
            "$trpc": "./src/lib/trpc/*",
            "$trpcmiddleware": "./src/lib/trpc/middleware/*"
        }
	}
};

export default config;
