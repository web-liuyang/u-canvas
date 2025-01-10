import { defineConfig } from "vite";
import { resolve } from "path";
// @ts-expect-error uni vite version mismatching
import uni from "@dcloudio/vite-plugin-uni";

export default defineConfig({
	plugins: [uni()],
	optimizeDeps: {
		// include: ["u-pointer"],
		// exclude: ["u-pointer"],
		// extensions: [".uvue", ".ts"],
		// force: true,
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "."),
			"@components": resolve(__dirname, "./components/"),
			"comp": resolve(__dirname, "./pages/pointer/comp-export.ts"),
			// "u-canvas": resolve(__dirname, "./packages/u-canvas"),
			// "u-pointer": resolve(__dirname, "./packages/u-pointer"),
			"@u-pointer": resolve(__dirname, "./packages/u-pointer/"),
		},
	},
});
