import { defineConfig, PluginOption } from "vite";
// @ts-expect-error uni vite version mismatching
import uni from "@dcloudio/vite-plugin-uni";

const uCanvasPlugin = (): PluginOption => {
	return {
		name: "uCanvasPlugin",
		enforce: "pre",
		transform(code, id, options) {
			const newCode = code
				.replace(/from "u-canvas"/g, `from "@/uni_modules/u-canvas/src/index"`)
				.replace(/from "u-pointer"/g, `from "@/uni_modules/u-pointer/index"`);

			return newCode;
		},
	};
};

export default defineConfig({
	plugins: [uni(), uCanvasPlugin()],
});
