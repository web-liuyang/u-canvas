import { defineConfig } from "vite";

export default defineConfig({
	optimizeDeps: {
		include: ["u-canvas", "u-canvas-components"],
	},
	// build: {},
});
