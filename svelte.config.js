import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import("@sveltejs/kit").Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
        alias: {
            "$styles": "./src/styles/*",
            "$components": "./src/components/*",
            "$stores": "./src/stores/*",
            "$trpcroutes": "./src/lib/trpc/routes/*"
        }
	}
};

export default config;
