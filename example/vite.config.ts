import { defineConfig } from "vite";
import { resolve } from "path";
// @ts-expect-error uni vite version mismatching
import uni from "@dcloudio/vite-plugin-uni";

export default defineConfig({
	plugins: [uni()],
	optimizeDeps: {
		// entries: [],
		exclude: ["node_modules", "u-canvas", "u-canvas-components"],
		// include: ["u-canvas"],
		force: true,
		holdUntilCrawlEnd: false,
	},
	// build: {
	// 	commonjsOptions: {
	// 		include: [/u-canvas/, /u-canvas-components/, /node_modules/],
	// 	},
	// },
	resolve: {
		alias: {
			"@u-canvas": resolve(__dirname, "./u-canvas"),
			"@u-canvas-components": resolve(__dirname, "./u-canvas-components"),
		},
	},
});
