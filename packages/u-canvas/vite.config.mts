import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const resolvePath = (path: string) => resolve(__dirname, path);

export default defineConfig({
	plugins: [
		dts({
			outDir: "./dist/types",
			exclude: ["node_modules"],
			tsconfigPath: resolvePath("./tsconfig.json"),
		}),
	],
	build: {
		lib: {
			entry: resolvePath("./src/index.ts"),
			formats: ["es"],
			name: "u-canvas",
			// the proper extensions will be added
			fileName: (format, entryName) => {
				return `${format}/${entryName}.js`;
			},
		},
		sourcemap: true, // 输出.map文件
		manifest: true,

		// rollupOptions: {
		// 	// make sure to externalize deps that shouldn't be bundled
		// 	// into your library
		// 	external: ["vue"],
		// 	output: {
		// 		// Provide global variables to use in the UMD build
		// 		// for externalized deps
		// 		globals: {
		// 			vue: "Vue",
		// 		},
		// 	},
		// },
	},
});
