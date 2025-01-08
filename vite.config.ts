import { defineConfig, HmrContext, Plugin } from "vite";
import { resolve } from "path";
import fs from "fs";
// @ts-expect-error uni vite version mismatching
import uni from "@dcloudio/vite-plugin-uni";

export default defineConfig({
	plugins: [uni()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "."),
			"@components": resolve(__dirname, "./components/"),
		},
	},
});
