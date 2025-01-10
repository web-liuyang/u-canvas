import { defineConfig, PluginOption } from "vite";
// @ts-expect-error uni vite version mismatching
import uni from "@dcloudio/vite-plugin-uni";

const uCanvasPlugin = (): PluginOption => {
	return {
		name: "uCanvasPlugin",
		enforce: "pre",
		transform(code, id, options) {
			const newCode = code
				.replace(/from "u-canvas"/g, `from "@/packages/u-canvas/src/index"`)
				.replace(/from "u-pointer"/g, `from "@/packages/u-pointer/src/index"`);

			return newCode;
		},
	};
};

export default defineConfig({
	plugins: [uni(), uCanvasPlugin()],
	optimizeDeps: {},
	resolve: {},
});
