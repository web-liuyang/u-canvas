import { defineConfig, HmrContext, Plugin } from "vite";
import { resolve } from "path";
// @@ts-expect-error uni vite version mismatching
import uni from "@dcloudio/vite-plugin-uni";
// import uni from "./dist";
// import uni from "./dist";

export default defineConfig({
	plugins: [uni()],
});
