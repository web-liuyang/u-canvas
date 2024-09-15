import { defineProject } from "vitest/config";
import { resolve } from "path";



export default defineProject({
	test: {
		setupFiles: ["./vitest.setup.ts"],
		environment: "happy-dom",
		deps: {
			optimizer: {
				web: {
					include: ["vitest-canvas-mock"],
				},
			},
		},
		poolOptions: {
			threads: {
				singleThread: true,
			},
		},
		// "reporters" is not supported in a project config,
		// so it will show an error
		// reporters: ["json"],
	},
	
});
