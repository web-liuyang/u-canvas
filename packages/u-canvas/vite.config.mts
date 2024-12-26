import { resolve } from "path";
import { defineConfig, Plugin } from "vite";
import fs from "fs";
import dts from "vite-plugin-dts";

function debounce(func: Function, delay: number): Function {
	let timer: NodeJS.Timeout;

	return function (...args: any[]) {
		const context = this;

		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(context, args);
		}, delay);
	};
}

const resolvePath = (path: string) => resolve(__dirname, path);

const restart = debounce(() => {
	const path = resolvePath("../../example/vite.config.ts");
	const data = fs.readFileSync(path);
	fs.writeFileSync(path, data);
}, 2000);

function restartExample(): Plugin {
	return {
		name: "restart-example",
		transform: (code: string, id: string) => {
			restart();
		},
	};
}

export default defineConfig({
	plugins: [
		dts({
			outDir: "./dist/types",
			exclude: ["node_modules"],
			tsconfigPath: resolvePath("./tsconfig.json"),
		}),
		restartExample(),
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
