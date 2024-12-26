import { resolve } from "path";
import { defineConfig, HmrContext, Plugin } from "vite";
import fs from "fs";
import dts from "vite-plugin-dts";

const resolvePath = (path: string) => resolve(__dirname, path);

function restartExample(): Plugin {
	return {
		name: "restart-example",
		transform: (code: string, id: string) => {
			const path = resolvePath("../../example/vite.config.ts");
			const data = fs.readFileSync(path);
			fs.writeFileSync(path, data);
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
			entry: "./src/index.ts",
			formats: ["es", "cjs"],
			fileName: "index",
		},
	},
});
