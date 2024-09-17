import { defineConfig } from "vite";
import { resolve } from "path";
// @ts-expect-error uni vite version mismatching
import uni from "@dcloudio/vite-plugin-uni";

export default defineConfig({
	plugins: [uni()],
	resolve: {
		alias: {
			"@u-canvas": resolve(__dirname, "./u-canvas"),
			"@u-canvas-components": resolve(__dirname, "./u-canvas-components"),
		},
	},
});
